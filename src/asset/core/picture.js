import { Vector2 } from '../../math/index.js'

// This is supposed to be `Image()` but that is already taken.
export class Picture {

  /**
   * @type {Uint8ClampedArray}
   */
  raw

  /**
   * @type {Vector2}
   */
  dimensions

  /**
   * @param {Uint8ClampedArray} buffer
   * @param {Vector2} dimensions
   */
  constructor(buffer, dimensions) {
    this.raw = buffer
    this.dimensions = dimensions
  }
    
  static default(){
    const array = new Uint8ClampedArray([1, 0, 1, 1])

    return new Picture(array, new Vector2(1, 1))
  }
}