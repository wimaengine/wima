/** @import {AssetId} from '../types/index.js' */
/** @import {Constructor} from '../../type/index.js'*/
import { packInto64Int, unpackFrom64Int } from '../../algorithms/index.js'
import { DenseList } from '../../datastructures/index.js'
import { typeid } from '../../type/index.js'
import { AssetAdded, AssetDropped, AssetEvent, AssetModified } from '../events/assets.js'
import { AssetServer } from '../resources/assetserver.js'
import { AssetChannel, AssetChannelMessageType } from './channel.js'

/**
 * @template T
 */
export class Assets {

  /**
   * @type {Constructor<T>}
   */
  type

  /**
   * @private
   * @type {DenseList<AssetEntry<T>>}
   */
  assets = new DenseList()

  /**
   * @private
   * @type {Map<string,Handle<T>>}
   */
  uuids = new Map()

  /**
   * @private
   * @type {AssetEvent<T>[]}
   */
  events = []

  /**
   * @readonly
   * @type {AssetChannel<T>}
   */
  channel = new AssetChannel()

  /**
   * @param {Constructor<T>} type
   */
  constructor(type) {
    this.type = type
  }

  /**
   * @param {T} asset
   * @returns {Handle<T>}
   */
  add(asset) {
    const handle = this.reserve()
    const entry = this.getEntry(handle)

    entry.asset = asset
    this.events.push(new AssetAdded(this.type, handle.id()))

    return handle
  }

  /**
   * @param {Handle<T>} handle
   * @param {T} asset
   */
  set(handle, asset) {
    const entry = this.getEntry(handle)

    if (!entry) return

    const oldAsset = entry.asset

    entry.asset = asset

    if (oldAsset) {
      this.events.push(new AssetModified(this.type, handle.id()))
    } else {
      this.events.push(new AssetAdded(this.type, handle.id()))
    }
  }

  /**
   * @param {AssetId} assetId
   * @param {T} asset
   */
  setUsingAssetId(assetId, asset) {
    const entry = this.getEntryByAssetId(assetId)

    if (!entry) return

    const oldAsset = entry.asset

    entry.asset = asset

    if (oldAsset) {
      this.events.push(new AssetModified(this.type, assetId))
    } else {
      this.events.push(new AssetAdded(this.type, assetId))
    }
  }

  /**
   * @param {string} uuid
   * @param {T} asset
   * @returns {Handle<T>}
   */
  setWithUUID(uuid, asset) {
    const handle = this.uuids.get(uuid)

    if (handle) {
      this.set(handle, asset)

      return handle.clone()
    }

    const newHandle = this.add(asset)

    this.uuids.set(uuid, newHandle.clone())

    return newHandle
  }

  /**
   * @param {Handle<T>} handle
   * @returns {AssetEntry<T> | undefined}
   */
  getEntry(handle) {
    const { index, generation } = handle

    return this.getEntryInternal(index, generation)
  }

  /**
   * @param {AssetId} assetId
   * @returns {AssetEntry<T> | undefined}
   */
  getEntryByAssetId(assetId) {
    const [index, generation] = unpackFrom64Int(assetId)

    return this.getEntryInternal(index, generation)
  }

  /**
   * @private
   * @param {number} index
   * @param {number} generation
   */
  getEntryInternal(index, generation) {
    const entry = this.assets.get(index)

    if (!entry) return undefined

    if (entry.generation !== generation) return undefined

    return entry
  }

  /**
   * @param {Handle<T>} handle
   * @returns {T | undefined}
   */
  get(handle) {
    const entry = this.getEntry(handle)

    if (!entry) return undefined

    return entry.asset
  }

  /**
   * @param {string} uuid
   * @returns {T | undefined}
   */
  getByUUID(uuid) {
    const handle = this.getHandleByUUID(uuid)

    if (!handle) return undefined

    return this.get(handle)
  }

  /**
   * @param {AssetId} id
   * @returns {T | undefined}
   */
  getByAssetId(id) {
    const entry = this.getEntryByAssetId(id)

    if (!entry) return undefined

    return entry.asset
  }

  /**
   * @param {string} uuid
   * @returns {Handle<T> | undefined}
   */
  getHandleByUUID(uuid) {
    return this.uuids.get(uuid)?.clone()
  }

  /**
   * @returns {Readonly<AssetEvent<T>[]>}
   */
  flushEvents() {
    const { events } = this

    if (events.length) this.events = []

    return events
  }

  /**
   * @param {Handle<T>} handle
   */
  drop(handle) {
    const entry = this.getEntry(handle)

    if (!entry) return

    entry.refCount -= 1

    if (entry.refCount <= 0) {
      entry.asset = undefined
      this.assets.recycle(handle.index)
      this.events.push(new AssetDropped(this.type, handle.id()))
    }
  }

  /**
   * @param {AssetId} assetId
   * @returns {Handle<T> | undefined}
   */
  upgrade(assetId) {
    const [index, generation] = unpackFrom64Int(assetId)
    const entry = this.getEntryInternal(index, generation)

    if (!entry) {
      return
    }
    entry.refCount += 1
    
    return new Handle(this.channel, this.type, index, generation)
  }

  /**
   * @returns {Handle<T>}
   *
   */
  reserve() {
    const index = this.assets.reserve()
    const entry = this.assets.get(index)

    if (entry) {
      entry.generation += 1
      entry.refCount = 1

      return new Handle(this.channel, this.type, index, entry.generation)
    }

    const newEntry = new AssetEntry(undefined)

    newEntry.generation += 1
    newEntry.refCount = 1
    this.assets.set(index, newEntry)

    return new Handle(this.channel, this.type, index, newEntry.generation)
  }

  values() {
    return this.assets.values()
  }

  /**
   * Drain and apply queued handle lifecycle messages.
   */
  update() {
    const messages = this.channel.flush()

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]

      if (message.type === AssetChannelMessageType.Acquire) {
        this.acquire(message.assetId)
      } else if (message.type === AssetChannelMessageType.Release) {
        this.release(message.assetId)
      }
    }
  }

  /**
   * @private
   * @param {AssetId} assetId
   */
  acquire(assetId) {
    const entry = this.getEntryByAssetId(assetId)

    if (!entry) return

    entry.refCount += 1
  }

  /**
   * @private
   * @param {AssetId} assetId
   */
  release(assetId) {
    const entry = this.getEntryByAssetId(assetId)

    if (!entry) return

    entry.refCount -= 1

    if (entry.refCount <= 0) {
      const [index] = unpackFrom64Int(assetId)

      entry.asset = undefined
      this.assets.recycle(index)
      this.events.push(new AssetDropped(this.type, assetId))
    }
  }
}

/**
 * @template T
 */
export class Handle {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  type

  /**
   * @private
   * @type {boolean}
   */
  dropped = false

  /**
   * @private
   * @readonly
   * @type {AssetChannel<T>}
   */
  channel

  /**
   * @readonly
   * @type {number}
   */
  index

  /**
   * @readonly
   * @type {number}
   */
  generation = 0

  /**
   * @param {AssetChannel<T>} channel
   * @param {Constructor<T>} type
   * @param {number} index
   * @param {number} generation
   */
  constructor(channel, type, index, generation) {
    this.index = index
    this.generation = generation
    this.channel = channel
    this.type = type
  }

  /**
   * @returns {AssetId}
   */
  id() {
    return /** @type {AssetId}*/ (packInto64Int(this.index, this.generation))
  }

  clone() {
    const { channel, index, generation } = this

    channel.acquire(this.id())

    return new Handle(channel, this.type, index, generation)
  }

  /**
   * Snapshot the handle with the asset server path when available.
   *
   * @param {import('../../ecs/index.js').World} world
   * @returns {HandleSnapshot<T>}
   */
  toSnapshot(world) {
    const server = world.getResource(AssetServer)
    const info = server?.getAssetInfo(this)

    if (info?.path) {
      return new HandleSnapshot(this.type, info.path)
    }

    return new HandleSnapshot(this.type, this.id())
  }

  drop() {
    if (this.dropped) return

    this.channel.release(this.id())
    this.dropped = true
  }
}

/**
 * A snapshot of an asset handle.
 *
 * The snapshot preserves the asset type and id, and stores the asset server
 * path when one is registered so the handle can be reloaded by path.
 *
 * @template T
 */
export class HandleSnapshot {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  type

  /**
   * @readonly
   * @type {AssetId | string}
   */
  asset

  /**
   * @param {Constructor<T>} type
   * @param {AssetId | string} asset
   */
  constructor(type, asset) {
    this.type = type
    this.asset = asset
  }

  /**
   * Restore the live handle from the asset server.
   *
   * If the asset server knows the path, we reload it by path. Otherwise we
   * upgrade the stored asset id against the asset pool.
   *
   * @param {import('../../ecs/index.js').World} world
   * @returns {Handle<T>}
   */
  fromSnapshot(world) {
    const server = world.getResource(AssetServer)

    if (typeof this.asset === 'string') {
      return /** @type {Handle<T>} */ (server.load(this.type, this.asset))
    }

    const assets = /** @type {Assets<T>} */ (server.getAssets(typeid(this.type)))

    // TODO: This is inherently incorrect. When scene resources are added,
    // the assetid will point to the wrong asset in the scene due to desync between
    // the scene and world when an assets are added/removed from the world or scene.
    // Add a mapping between scene assets and world assets and use that to create
    // the asset handle. Also ensure the assets are loaded into world before spawning
    // the scene into the world.

    return /** @type {Handle<T>} */ (assets.upgrade(this.asset))
  }
}

/**
 * @template T
 */
export class AssetEntry {

  /**
   * @type {T | undefined}
   */
  asset

  /**
   * @type {number}
   */
  refCount = 0

  /**
   * @type {number}
   */
  generation = 0

  /**
   * @param {T} asset
   */
  constructor(asset) {
    this.asset = asset
  }
}
