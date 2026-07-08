export class SoftBody2D {

  /**
   * @param {SoftBody2D} source
   * @param {SoftBody2D} target
   */
  static copy(source, target = new SoftBody2D()) {
    return target
  }

  /**
   * @param {SoftBody2D} target
   */
  static clone(target) {
    return SoftBody2D.copy(target)
  }

  /**
   * @param {SoftBody2D} _value
   */
  static serialize(_value) {
    return {}
  }

  /**
   * @param {unknown} _value
   * @param {SoftBody2D} [out]
   */
  static deserialize(_value, out = new SoftBody2D()) {
    return out
  }
}

export class SoftBody3D {

  /**
   * @param {SoftBody3D} source
   * @param {SoftBody3D} target
   */
  static copy(source, target = new SoftBody3D()) {
    return target
  }

  /**
   * @param {SoftBody3D} target
   */
  static clone(target) {
    return SoftBody3D.copy(target)
  }

  /**
   * @param {SoftBody3D} _value
   */
  static serialize(_value) {
    return {}
  }

  /**
   * @param {unknown} _value
   * @param {SoftBody3D} [out]
   */
  static deserialize(_value, out = new SoftBody3D()) {
    return out
  }
}
