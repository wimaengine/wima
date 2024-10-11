/** @import { Entity } from '../../ecs/index.js' */

export class Parent {

  /**
   * @private
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