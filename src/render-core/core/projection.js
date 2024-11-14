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

export class PerspectiveProjection extends Projection {

  /**
   * @readonly
   * @type {ProjectionType}
   */
  type = ProjectionType.Perspective

  /**
   * @type {number}
   */
  fov

  /**
   * @type {number}
   */
  aspect

  /**
   * @param {number} fov 
   * @param {number} aspect 
   */
  constructor(fov = Math.PI / 2, aspect = 1) {
    super()
    this.fov = fov
    this.aspect = aspect
  }

  isPerspective() {
    return true
  }

  /**
   * @param {number} near
   * @param {number} far
   * @returns {Matrix4}
   */
  asProjectionMatrix(near, far) {
    const top = near * Math.tan(0.5 * this.fov)
    const height = 2 * top
    const width = this.aspect * height
    const left = -0.5 * width

    return PerspectiveProjection.from(left, left + width, top, top - height, near, far)
  }
  
  /**
   * @param {number} left
   * @param {number} right
   * @param {number} top
   * @param {number} bottom
   * @param {number} near
   * @param {number} far
   * @param out
   */
  static from(left, right, top, bottom, near, far, out = new Matrix4()) {
    const x = 2 * near / (right - left)
    const y = 2 * near / (top - bottom)

    const a = (right + left) / (right - left)
    const b = (top + bottom) / (top - bottom)

    const c = -(far + near) / (far - near)
    const d = (-2 * far * near) / (far - near)

    out.a = x
    out.b = 0
    out.c = 0
    out.d = 0
    out.e = 0
    out.f = y
    out.g = 0
    out.h = 0
    out.i = a
    out.j = b
    out.k = c
    out.l = -1
    out.m = 0
    out.n = 0
    out.o = d
    out.p = 0

    return out
  }
}