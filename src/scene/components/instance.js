export class SceneInstance {
  /**
   * @type {Map<Entity,Entity>}
   */
  entityMap = new Map()
  /**
   * @type {Handle<Scene>}
   */
  handle
  constructor(handle){
    this.handle = handle
  }
}