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
    return this.copy(target)
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
    return this.copy(target)
  }
}
