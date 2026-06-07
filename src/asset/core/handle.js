/** @import {AssetId} from '../types/index.js' */
/** @import {Assets} from '../resources/assets.js' */
/** @import {Constructor} from '../../type/index.js'*/

import { packInto64Int } from '../../datastructures/index.js'
import { typeid } from '../../type/index.js'
import { AssetServer } from '../resources/assetserver.js'
import { AssetChannel } from './channel.js'

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
   * @type {import('../../type/index.js').TypeId}
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
    this.type = typeid(type)
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
      return /** @type {Handle<T>} */ (server.loadUntyped(this.type, this.asset))
    }

    const assets = /** @type {Assets<T>} */ (server.getAssets(this.type))

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
 * @typedef {Handle<unknown>} UntypedHandle
 */
