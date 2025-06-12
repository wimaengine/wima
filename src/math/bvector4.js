export class BVector4 {

  /**
   * @type {boolean}
   */
  x

  /**
   * @type {boolean}
   */
  y

  /**
   * @type {boolean}
   */
  z

  /**
   * @type {boolean}
   */
  w
  constructor(x = false, y = false, z = false, w = false){
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }
}