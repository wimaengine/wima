/** @import { EntityId } from '../../ecs/index.js' */
/** @import { Scene } from "../assets/scene.js" */
import { Handle, HandleSnapshot } from '../../asset/index.js'

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
   * @type {HandleSnapshot<Scene>}
   */
  handle

  /**
   * @param {HandleSnapshot<Scene>} handle
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * @param {import('../../ecs/index.js').World} world
   * @returns {SceneInstance}
   */
  fromSnapshot(world) {
    return new SceneInstance(this.handle.fromSnapshot(world))
  }
}
