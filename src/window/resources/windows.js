/** @import {Entity} from '../../ecs/index.js'*/

import { assert } from '../../logger/index.js'

export class Windows {

  /**
   * @private
   * @type {Map<number,HTMLCanvasElement>}
   */
  entities = new Map()

  /**
   * @param {Entity} entity
   * @returns {HTMLCanvasElement}
   */
  getWindow(entity){
    const window = this.entities.get(entity.index)
    
    assert(window, 'the provided window entity does not have a corresponding canvas element.')

    return window
  }

  /**
   * @param {Entity} entity
   * @param {HTMLCanvasElement} window
   */
  setWindow(entity, window){
    this.entities.set(entity.index, window)
  }
  
  /**
   * @param {Entity} entity
   */
  delete(entity){
    this.entities.delete(entity.index)
  }
}