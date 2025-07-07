/** @import {Entity,EntityId} from '../../ecs/index.js'*/

export class Windows {

  /**
   * @private
   * @type {Map<EntityId,HTMLCanvasElement>}
   */
  entities = new Map()

  /**
   * @param {Entity} entity
   * @returns {HTMLCanvasElement | undefined}
   */
  getWindow(entity){
    const window = this.entities.get(entity.id())
    
    return window
  }

  /**
   * @param {Entity} entity
   * @param {HTMLCanvasElement} window
   */
  setWindow(entity, window){
    this.entities.set(entity.id(), window)
  }
  
  /**
   * @param {Entity} entity
   */
  delete(entity){
    this.entities.delete(entity.id())
  }
}