/** @import { Entity } from '../../ecs/index.js' */

export class Children {

  /**
   * @public
   * @type {Entity[]}
   */
  list = []

   
  /**
   * @param {Entity[]} children
   */
  constructor(children = []){
    this.list = children
  }

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