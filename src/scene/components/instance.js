/**@import { EntityId } from '../../ecs/index.js' */
/**@import { Scene } from "../assets/scene.js" */
import { Handle } from "../../asset/index.js"

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
  constructor(handle){
    this.handle = handle
  }
}