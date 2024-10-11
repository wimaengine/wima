/** @import { Entity } from '../../ecs/index.js' */

export class Children {

  /**
   * @private
   * @type {Entity[]}
   */
  list = []

  /**
   * @param {Entity} entity
   */
  add(entity) {
    this.list.push(entity)
  }

  /**
   * @param {Entity} entity
   */
  remove(entity) {
    this.list.splice(this.list.indexOf(entity), 1)
  }

  /**
   */
  clear(){
    this.list.length = 0
  }
}