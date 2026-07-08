/** @import { EntityId } from '@wimaengine/ecs' */
/** @import { Scene } from "../assets" */
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
   * @param {Handle<Scene>} handle
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * @param {SceneInstance} source
   * @param {SceneInstance} target
   */
  static copy(source, target = new SceneInstance(source.handle)) {
    target.handle = source.handle.clone()

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
    return new SceneInstanceSnapshot(this.handle.toSnapshot(world))
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
   * @param {HandleSnapshot} handle
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * @param {import('@wimaengine/ecs').World} world
   * @param {import('@wimaengine/asset').AssetId} sceneAssetId
   * @returns {SceneInstance}
   */
  fromSnapshot(world, sceneAssetId) {
    return new SceneInstance(/** @type {Handle<Scene>} */(this.handle.fromSnapshot(world, sceneAssetId)))
  }

  /**
   * @param {SceneInstanceSnapshot} value
   */
  static serialize(value) {
    return {
      handle: HandleSnapshot.serialize(value.handle)
    }
  }

  /**
   * @param {SceneInstanceSnapshotSerial} value
   * @param {SceneInstanceSnapshot} [out]
   */
  static deserialize(value, out = new SceneInstanceSnapshot(new HandleSnapshot(typeid(Object), ''))) {
    out.handle = HandleSnapshot.deserialize(value.handle, out.handle)

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

    return HandleSnapshot.validateSerial(value.handle)
  }
}

/**
 * @typedef SceneInstanceSnapshotSerial
 * @property {import('@wimaengine/asset').HandleSnapshotSerial} handle
 */
