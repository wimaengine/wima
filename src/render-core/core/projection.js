import { Matrix4 } from '../../math/index.js'

export class Projection {

  /**
   * @returns {Matrix4}
   * @param {number} _near
   * @param {number} _far
   */
  asProjectionMatrix(_near, _far) {
    return new Matrix4()
  }

  /**
   * @returns {boolean}
   */
  isPerspective() {
    return false
  }

  /**
   * @returns {boolean}
   */
  isOrthographic() {
    return false
  }
}