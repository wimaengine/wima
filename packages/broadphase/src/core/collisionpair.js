/** @import { EntityHandle } from '@wimaengine/ecs'*/

export class CollisionPair {

  /**
   * @type {EntityHandle}
   */
  a

  /**
   * @type {EntityHandle}
   */
  b

  /**
   * @param {EntityHandle} a
   * @param {EntityHandle} b
   */
  constructor(a, b) {
    this.a = a
    this.b = b
  }
}
