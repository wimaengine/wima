import { Vector2 } from '../../../math/index.js'

export class Scale2D extends Vector2 {
  constructor(x = 1, y = 1) {
    super(x, y)
  }

  /**
   * @param {Scale2D} source
   * @param {Scale2D} target
   */
  static copy(source, target = new Scale2D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Scale2D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
