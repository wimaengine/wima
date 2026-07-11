/** @import {AssetId} from '../types' */
/** @import {Assets} from '../resources' */
/** @import {Constructor, TypeId} from '@wimaengine/type'*/

import { packInto64Int } from '@wimaengine/datastructures'
import { setTypeId, typeid } from '@wimaengine/type'
import { AssetServer } from '../resources'
import { AssetChannel } from './channel'

const assetSceneMapId = setTypeId('AssetSceneMap')

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
   * @param {import('@wimaengine/ecs').World} world
   * @returns {HandleSnapshot}
   */
  toSnapshot(world) {
    const server = world.getResource(AssetServer)
    const info = server?.getAssetInfo(this)

    if (info?.path) {
      return new HandleSnapshot(typeid(this.type), info.path)
    }

    return new HandleSnapshot(typeid(this.type), this.index)
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
 * The snapshot preserves the asset type and snapshot index, and stores the asset server
 * path when one is registered so the handle can be reloaded by path.
 */
export class HandleSnapshot {

  /**
   * @type {import('@wimaengine/type').TypeId}
   */
  type

  /**
   * @type {number | string}
   */
  asset

  /**
   * @param {TypeId} typeId
   * @param {number | string} asset
   */
  constructor(typeId, asset) {
    this.type = typeId
    this.asset = asset
  }

  /**
   * Restore the live handle from the asset server.
   *
   * If the asset server knows the path, we reload it by path. Otherwise we
   * upgrade the stored snapshot index against the asset pool.
   *
   * @param {import('@wimaengine/ecs').World} world
   * @param {AssetId} [sceneAssetId]
   * @returns {UntypedHandle | undefined}
   */
  fromSnapshot(world, sceneAssetId) {
    const server = world.getResource(AssetServer)

    if (typeof this.asset === 'string') {
      return server.loadUntyped(this.type, this.asset)
    }

    if (sceneAssetId !== undefined && world.hasResourceByTypeId(assetSceneMapId)) {

      /** @type {{ get: Function }} */
      const sceneMap = world.getResourceByTypeId(assetSceneMapId)
      const mapped = sceneMap.get(sceneAssetId, this.type, this.asset)

      if (mapped) {
        return mapped
      }
    }

    return undefined
  }

  /**
   * @param {HandleSnapshot} value
   */
  static serialize(value) {
    return {
      type: value.type,
      asset: value.asset
    }
  }

  /**
   * @param {HandleSnapshotSerial} value
   * @param {HandleSnapshot} [out]
   */
  static deserialize(value, out = new HandleSnapshot(typeid(Object), '')) {
    out.type = value.type
    out.asset = value.asset

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is HandleSnapshotSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('asset' in value)) {
      return false
    }

    return typeof value.type === 'string' &&
      (typeof value.asset === 'number' || typeof value.asset === 'string')
  }
}

/**
 * @typedef {Handle<unknown>} UntypedHandle
 */

/**
 * @typedef HandleSnapshotSerial
 * @property {TypeId} type
 * @property {number | string} asset
 */
