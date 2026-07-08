/** @import {EntityHandle,EntityId} from '@wimaengine/ecs'*/

export class Windows {

  /**
   * @private
   * @type {Map<EntityId,HTMLCanvasElement>}
   */
  entities = new Map()

  /**
   * @param {EntityHandle} entity
   * @returns {HTMLCanvasElement | undefined}
   */
  getWindow(entity) {
    const window = this.entities.get(entity.id())

    return window
  }

  /**
   * @param {EntityHandle} entity
   * @param {HTMLCanvasElement} window
   */
  setWindow(entity, window) {
    this.entities.set(entity.id(), window)
  }

  /**
   * @param {EntityHandle} entity
   */
  delete(entity) {
    this.entities.delete(entity.id())
  }
}
