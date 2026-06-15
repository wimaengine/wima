/** @import { EntityId } from '../../ecs/index.js' */
/** @import { Scene } from "../assets/scene.js" */
import { Handle, HandleSnapshot } from '../../asset/index.js'
import { typeid } from '../../type/index.js'

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
   * @param {import('../../ecs/index.js').World} world
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
   * @param {import('../../ecs/index.js').World} world
   * @returns {SceneInstance}
   */
  fromSnapshot(world) {
    return new SceneInstance(/**@type {Handle<Scene>} */(this.handle.fromSnapshot(world)))
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
  static deserialize(value, out = new SceneInstanceSnapshot(new HandleSnapshot(typeid(Object),''))) {
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
 * @property {import('../../asset/core/handle.js').HandleSnapshotSerial} handle
 */
