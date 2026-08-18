import { Vector2 } from '@wimaengine/math'

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
    return Scale2D.copy(target)
  }

  /**
   * @param {Scale2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector2Like} value
   * @param {Scale2D} [out]
   */
  static deserialize(value, out = new Scale2D()) {
    return super.deserialize(value, out)
  }
}
