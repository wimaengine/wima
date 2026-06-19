import { Vector2, Vector3 } from '../../math/index.js'

export class Gravity2D extends Vector2 {

  /**
   * @param {Gravity2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('../../math/core/vectors/float/vector2.js').Vector2Serial} value
   * @param {Gravity2D} [out]
   */
  static deserialize(value, out = new Gravity2D()) {
    return super.deserialize(value, out)
  }
}

export class Gravity3D extends Vector3 {

  /**
   * @param {Gravity3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('../../math/core/vectors/float/vector3.js').Vector3Serial} value
   * @param {Gravity3D} [out]
   */
  static deserialize(value, out = new Gravity3D()) {
    return super.deserialize(value, out)
  }
}
