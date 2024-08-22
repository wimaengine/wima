/**
 * Wrapper class since JavaScript doesn't support references to numbers explicitly.
 * Keeps record of the orientation of an entity.
 */
export class Angle {

  /**
   * Orientation in radians.
   *
   * @type {number}
   */
  value = 0

  /**
   * @param {number} [rad=0] - Angle in radians.
   */
  constructor(rad = 0) {
    this.value = rad
  }

  /**
   * Copies the orientation of another angle.
   *
   * @param {Angle} angle
   */
  static copy(angle) {
    this.value = angle.value
  }
}