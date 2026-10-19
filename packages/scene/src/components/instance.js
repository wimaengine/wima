/** @import { EntityId } from '@wimaengine/ecs' */
/** @import { Scene } from "../assets" */
/** @import { SceneFilter } from '../assets' */
import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { typeid } from '@wimaengine/type'

export class SceneInstance {

  /**
   * @type {Map<EntityId,EntityId>}
   */
  entityMap = new Map()

  /**
   * @type {Handle<Scene>}
   */
  handle

  /**
   * @type {Handle<SceneFilter> | undefined}
   */
  filter

  /**
   * @param {Handle<Scene>} handle
   * @param {Handle<SceneFilter>} [filter]
   */
  constructor(handle, filter) {
    this.handle = handle
    this.filter = filter
  }

  /**
   * @param {SceneInstance} source
   * @param {SceneInstance} target
   */
  static copy(source, target = new SceneInstance(source.handle, source.filter)) {
    target.handle = source.handle.clone()
    target.filter = source.filter?.clone()

    return target
  }

  /**
   * @param {SceneInstance} target
   */
  static clone(target) {
    return SceneInstance.copy(target)
  }

  /**
   * @param {import('@wimaengine/ecs').World} world
   * @returns {SceneInstanceSnapshot}
   */
  toSnapshot(world) {
    return new SceneInstanceSnapshot(
      this.handle.toSnapshot(world),
      this.filter?.toSnapshot(world)
    )
  }
}

/**
 * Snapshot of a scene instance.
 */
export class SceneInstanceSnapshot {

  /**
   * @type {HandleSnapshot}
   */
  handle

  /**
   * @type {HandleSnapshot | undefined}
   */
  filter

  /**
   * @param {HandleSnapshot} handle
   * @param {HandleSnapshot} [filter]
   */
  constructor(handle, filter) {
    this.handle = handle
    this.filter = filter
  }

  /**
   * @param {import('@wimaengine/ecs').World} world
   * @param {import('@wimaengine/asset').AssetId} sceneAssetId
   * @returns {SceneInstance}
   */
  fromSnapshot(world, sceneAssetId) {
    return new SceneInstance(
      /** @type {Handle<Scene>} */(this.handle.fromSnapshot(world, sceneAssetId)),
      /** @type {Handle<SceneFilter> | undefined} */(this.filter?.fromSnapshot(world, sceneAssetId))
    )
  }

  /**
   * @param {SceneInstanceSnapshot} value
   */
  static serialize(value) {
    return {
      handle: HandleSnapshot.serialize(value.handle),
      filter: value.filter && HandleSnapshot.serialize(value.filter)
    }
  }

  /**
   * @param {SceneInstanceSnapshotSerial} value
   * @param {SceneInstanceSnapshot} [out]
   */
  static deserialize(value, out = new SceneInstanceSnapshot(new HandleSnapshot(typeid(Object), ''))) {
    out.handle = HandleSnapshot.deserialize(value.handle, out.handle)
    out.filter = value.filter
      ? HandleSnapshot.deserialize(value.filter, out.filter)
      : undefined

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is SceneInstanceSnapshotSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('handle' in value)) {
      return false
    }

    if (!HandleSnapshot.validateSerial(value.handle)) {
      return false
    }

    return !('filter' in value) ||
      value.filter === undefined ||
      HandleSnapshot.validateSerial(value.filter)
  }
}

/**
 * @typedef SceneInstanceSnapshotSerial
 * @property {import('@wimaengine/asset').HandleSnapshotSerial} handle
 * @property {import('@wimaengine/asset').HandleSnapshotSerial} [filter]
 */
