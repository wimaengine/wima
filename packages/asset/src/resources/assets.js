/** @import {AssetId} from '../types' */
/** @import {Constructor, TypeId} from '@wimaengine/type' */

import { unpackFrom64Int, DenseList, IndexAllocator } from '@wimaengine/datastructures'
import { AssetAdded, AssetDropped, AssetEvent, AssetModified } from '../events'
import { AssetChannel, AssetChannelMessageType } from '../core'
import { Handle } from '../core'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { TypeEntry, TypeRegistry } from '@wimaengine/reflect'
import { warn } from '@wimaengine/logger'

const assetSceneMapId = setTypeId('AssetSceneMap')

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
  assets = new DenseList(new IndexAllocator())

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
   * @param {import('@wimaengine/ecs').World} world
   * @returns {AssetsSnapshot<unknown>}
   */
  toSnapshot(world) {
    const typeRegistry = world.getResource(TypeRegistry)
    const typeEntry = typeRegistry.get(this.type)
    const assets = this.assets.values().map((entry) => {
      if (
        typeEntry &&
        entry.asset !== undefined
      ) {
        return typeEntry.call('serialize', [entry.asset])
      }

      return entry.asset
    })

    return new AssetsSnapshot(typeid(this.type), assets)
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

/**
 * @template T
 */
export class AssetsSnapshot {

  /**
   * @type {TypeId}
   */
  type

  /**
   * Dense, index-aligned snapshot of the source `Assets<T>` container.
   * @type {(T | undefined)[]}
   */
  assets

  /**
   * @param {TypeId} type
   * @param {(T | undefined)[]} assets
   */
  constructor(type, assets) {
    this.type = type
    this.assets = assets
  }

  /**
   * @param {TypeId} assetType
   * @returns {TypeId}
   */
  static typeId(assetType) {
    return setTypeId(`AssetsSnapshot<${assetType}>`)
  }

  /**
   * @param {import('@wimaengine/ecs').World} world
   * @param {AssetId} sceneAssetId
   * @returns {Assets<unknown> | undefined}
   */
  fromSnapshot(world, sceneAssetId) {

    /** @type {{ clear: Function, set: Function }} */
    const sceneMap = world.getResourceByTypeId(assetSceneMapId)
    const typeEntry = world.getResource(TypeRegistry).getByTypeId(this.type)

    if (!typeEntry?.constructorFn) {
      return undefined
    }

    const assets = new Assets(typeEntry.constructorFn)

    patchInternal(this, sceneMap, assets, sceneAssetId, typeEntry)

    return assets
  }

  /**
   * @param {AssetsSnapshot<unknown>} snapshot
   * @param {import('@wimaengine/ecs').World} world
   * @param {AssetId} sceneAssetId
   * @returns {boolean}
   */
  static patch(snapshot, world, sceneAssetId) {
    const typeEntry = world.getResource(TypeRegistry).getByTypeId(snapshot.type)

    if (!typeEntry || !typeEntry.constructorFn) {
      return false
    }

    const assets = world.getResourceByTypeId(typeidGeneric(Assets, [typeEntry.constructorFn]))

    /** @type {{ clear: Function, set: Function }} */
    const sceneMap = world.getResourceByTypeId(assetSceneMapId)

    sceneMap.clear(sceneAssetId, snapshot.type)
    patchInternal(snapshot, sceneMap, assets, sceneAssetId, typeEntry)

    return true
  }

  /**
   * @param {AssetsSnapshot<unknown>} value
   */
  static serialize(value) {
    return {
      type: value.type,
      assets: value.assets
    }
  }

  /**
   * @param {AssetsSnapshotSerial} value
   * @param {AssetsSnapshot<unknown>} [out]
   */
  static deserialize(value, out = new AssetsSnapshot(typeid(Object), [])) {
    out.type = value.type
    out.assets = value.assets

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is AssetsSnapshotSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('assets' in value)) {
      return false
    }

    return typeof value.type === 'string' && Array.isArray(value.assets)
  }
}

/**
 * @template T
 * @param {AssetsSnapshot<T>} snapshot
 * @param {{ clear: Function, set: Function }} sceneMap
 * @param {Assets<T>} assetContainer
 * @param {AssetId} sceneAssetId
 * @param {TypeEntry} typeEntry
 */
function patchInternal(snapshot, sceneMap, assetContainer, sceneAssetId, typeEntry) {
  sceneMap.clear(sceneAssetId, snapshot.type)

  for (let i = 0; i < snapshot.assets.length; i++) {
    const asset = snapshot.assets[i]

    if (asset === undefined) {
      sceneMap.set(sceneAssetId, snapshot.type, i, assetContainer.reserve())
    } else {

      const actualAsset = /** @type {T | undefined} */(typeEntry.call('deserialize', [asset]))

      if (actualAsset) {
        sceneMap.set(sceneAssetId, snapshot.type, i, assetContainer.add(actualAsset))
      } else {
        warn(`No method to deserialize the asset type \`${snapshot.type}\``)
      }
    }
  }
}

/**
 * @typedef AssetsSnapshotSerial
 * @property {TypeId} type
 * @property {unknown[]} assets
 */
