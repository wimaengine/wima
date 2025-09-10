/** @import { Entity } from '../../ecs/index.js' */

import { VisitEntities } from '../../relationship/index.js'

/**
 * @implements {VisitEntities}
 */
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
  visit(){
    return [this.entity]
  }
}