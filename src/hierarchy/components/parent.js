/** @import { Entity } from '../../ecs/index.js' */

export class Parent {

  /**
   * @public
   * @type {Entity}
   */
  entity

  /**
   * @param {Entity} entity
   */
  constructor(entity) {
    this.entity = entity
  }
}