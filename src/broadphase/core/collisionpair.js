/** @import { EntityHandle } from '../../ecs/index.js'*/

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
