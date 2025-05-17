import { Vector3 } from './vector3.js'

export class Basis3 {

  /**
   * @type {Vector3}
   */
  x

  /**
   * @type {Vector3}
   */
  y

  /**
   * @type {Vector3}
   */
  z
  constructor(
    x = new Vector3(1, 0, 0),
    y = new Vector3(0, 1, 0),
    z = new Vector3(0, 0, 1)
  ) {
    this.x = x
    this.y = y
    this.z = z
  }
}