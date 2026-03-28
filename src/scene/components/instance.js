/** @import { EntityId } from '../../ecs/index.js' */
/** @import { Scene } from "../assets/scene.js" */
import { Handle } from '../../asset/index.js'

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
    return this.copy(target)
  }
}
