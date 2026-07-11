import { Matrix4 } from '@wimaengine/math'

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

  /**
   * @param {unknown} _value
   */
  static serialize(_value) {
    return {}
  }

  /**
   * @param {unknown} _value
   * @param {Projection} [out]
   */
  static deserialize(_value, out = new Projection()) {
    return out
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
   * @param {Matrix4} out
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

  /**
   * @param {PerspectiveProjection} value
   */
  static serialize(value) {
    return {
      type: 'perspective',
      fov: value.fov,
      aspect: value.aspect
    }
  }

  /**
   * @param {PerspectiveProjectionSerial} value
   * @param {PerspectiveProjection} [out]
   */
  static deserialize(value, out = new PerspectiveProjection()) {
    out.fov = value.fov
    out.aspect = value.aspect

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is PerspectiveProjectionSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('fov' in value) || !('aspect' in value)) {
      return false
    }

    return value.type === 'perspective' &&
      typeof value.fov === 'number' &&
      typeof value.aspect === 'number'
  }
}

export class OrthographicProjection extends Projection {

  /**
   * @readonly
   * @type {ProjectionType}
   */
  type = ProjectionType.Orthographic
  constructor(left = -1, right = 1, top = 1, bottom = -1) {
    super()
    this.left = left
    this.right = right
    this.top = top
    this.bottom = bottom
  }

  isOrthographic() {
    return true
  }

  /**
   * @param {number} near
   * @param {number} far
   * @returns {Matrix4}
   */
  asProjectionMatrix(near, far) {
    return OrthographicProjection.from(this.left, this.right, this.top, this.bottom, near, far)
  }

  /**
   * @param {number} left
   * @param {number} right
   * @param {number} top
   * @param {number} bottom
   * @param {number} near
   * @param {number} far
   * @param {Matrix4} out
   */
  static from(left, right, top, bottom, near, far, out = new Matrix4()) {

    const w = 1.0 / (right - left)
    const h = 1.0 / (top - bottom)
    const p = 1.0 / (far - near)

    const x = (right + left) * w
    const y = (top + bottom) * h

    const z = (far + near) * p
    const zInv = -2 * p

    out.a = 2 * w
    out.b = 0
    out.c = 0
    out.d = 0

    out.e = 0
    out.f = 2 * h
    out.g = 0
    out.h = 0

    out.i = 0
    out.j = 0
    out.k = zInv
    out.l = 0

    out.m = -x
    out.n = -y
    out.o = -z
    out.p = 1

    return out
  }

  /**
   * @param {OrthographicProjection} value
   */
  static serialize(value) {
    return {
      type: 'orthographic',
      left: value.left,
      right: value.right,
      top: value.top,
      bottom: value.bottom
    }
  }

  /**
   * @param {OrthographicProjectionSerial} value
   * @param {OrthographicProjection} [out]
   */
  static deserialize(value, out = new OrthographicProjection()) {
    out.left = value.left
    out.right = value.right
    out.top = value.top
    out.bottom = value.bottom

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is OrthographicProjectionSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('left' in value) || !('right' in value) || !('top' in value) || !('bottom' in value)) {
      return false
    }

    return value.type === 'orthographic' &&
      typeof value.left === 'number' &&
      typeof value.right === 'number' &&
      typeof value.top === 'number' &&
      typeof value.bottom === 'number'
  }
}

/**
 * @typedef PerspectiveProjectionSerial
 * @property {'perspective'} type
 * @property {number} fov
 * @property {number} aspect
 */

/**
 * @typedef OrthographicProjectionSerial
 * @property {'orthographic'} type
 * @property {number} left
 * @property {number} right
 * @property {number} top
 * @property {number} bottom
 */

/**
 * @readonly
 * @enum {number}
 */
export const ProjectionType = {
  Perspective: 0,
  Orthographic: 1
}

/**
 * @typedef {PerspectiveProjectionSerial | OrthographicProjectionSerial} ProjectionSerial
 */
