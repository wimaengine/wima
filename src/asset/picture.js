import { Vector2 } from '../math/index.js'

// This is supposed to be `Image()` but that is already taken.
export class Picture {

  /**
   * @type {ArrayBuffer}
   */
  raw

  /**
   * @type {Vector2}
   */
  dimensions

  /**
   * @param {ArrayBuffer} buffer
   * @param {Vector2} dimensions
   */
  constructor(buffer, dimensions) {
    this.raw = buffer
    this.dimensions = dimensions
  }
}