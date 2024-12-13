import { Vector2 } from './vector2.js'

export class Basis2 {

  /**
   * @type {Vector2}
   */
  x

  /**
   * @type {Vector2}
   */
  y

  /**
   * @param {Vector2} x 
   * @param {Vector2} y 
   */
  constructor(x = new Vector2(1, 0), y = new Vector2(0, 1)){
    this.x = x
    this.y = y
  }
}