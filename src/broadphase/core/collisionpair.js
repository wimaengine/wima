/** @import { Entity } from '../../ecs/index.js'*/

export class CollisionPair {

  /**
   * @type {Entity}
   */
  a

  /**
   * @type {Entity}
   */
  b

  /**
   * @param {Entity} a 
   * @param {Entity} b 
   */
  constructor(a, b) {
    this.a = a
    this.b = b
  }
}