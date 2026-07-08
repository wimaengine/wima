import { Vector2, Vector3 } from '@wimaengine/math'

export class Gravity2D extends Vector2 {

  /**
   * @param {Gravity2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector2Serial} value
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
   * @param {import('@wimaengine/math').Vector3Serial} value
   * @param {Gravity3D} [out]
   */
  static deserialize(value, out = new Gravity3D()) {
    return super.deserialize(value, out)
  }
}
