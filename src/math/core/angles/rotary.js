import { TAU } from '../constants.js'
import { clamp, fuzzyEqual } from '../functions/index.js'
import { Matrix2 } from '../matrices/index.js'

export class Rotary {

  /**
   * @type {number}
   */
  cos

  /**
   * @type {number}
   */
  sin

  constructor(cos = 1, sin = 0) {
    this.cos = cos
    this.sin = sin
  }

  /**
   * @param {number} cos
   * @param {number} sin
   */
  set(cos, sin) {
    Rotary.set(cos, sin, this)

    return this
  }

  /**
   * @param { Rotary} v
   * @returns {this}
   */
  copy(v) {
    Rotary.copy(v, this)

    return this
  }

  /**
   * @returns {Rotary}
   */
  clone() {
    return Rotary.copy(this)
  }

  /**
   * @returns {number}
   */
  magnitudeSquared() {
    return Rotary.magnitudeSquared(this)
  }

  /**
   * @returns {number}
   */
  magnitude() {
    return Rotary.magnitude(this)
  }

  /**
   * @returns {this}
   */
  normalize() {
    Rotary.normalize(this, this)

    return this
  }

  /**
   * @param {number} angle
   * @returns {this}
   */
  rotate(angle) {
    Rotary.rotate(angle, this)

    return this
  }

  /**
   * @param {Rotary} rotary
   * @returns {this}
   */
  multiply(rotary) {
    Rotary.multiply(rotary, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  multiplyScalar(scalar) {
    Rotary.multiplyScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Rotary} rotary
   * @returns {number}
   */
  dot(rotary) {
    return Rotary.dot(this, rotary)
  }

  /**
   * @returns {this}
   */
  reverse() {
    Rotary.reverse(this, this)

    return this
  }

  /**
   * @param {Rotary} rotary
   * @returns {boolean}
   */
  equals(rotary) {
    return Rotary.equal(rotary, this)
  }

  /**
   * @param {number} cos
   * @param {number} sin
   * @param {Rotary} out
   * @returns {Rotary}
   */
  static set(cos, sin, out = new Rotary()) {
    out.cos = cos
    out.sin = sin

    return out
  }

  /**
   * @param {Rotary} rotary
   * @param {Rotary} out
   * @returns {Rotary}
   */
  static copy(rotary, out = new Rotary()) {
    out.cos = rotary.cos
    out.sin = rotary.sin

    return out
  }

  /**
   * @param {Rotary} out
   * @returns {Rotary} 
   */
  static identity(out = new Rotary()) {
    out.cos = 1
    out.sin = 0

    return out
  }

  /** 
   * @param {Rotary} out
   * @returns {Rotary} 
   */
  static zero(out = new Rotary()) {
    out.cos = 0
    out.sin = 0

    return out
  }

  /**
   * @param {Rotary} q
   * @returns {number}
   */
  static magnitudeSquared(q) {
    return q.cos * q.cos + q.sin * q.sin
  }

  /**
   * @param {Rotary} q
   * @returns {number}
   */
  static magnitude(q) {
    return Math.sqrt(this.magnitudeSquared(q))
  }

  /**
   * @param {Rotary} q
   * @param {Rotary} out
   * @returns {Rotary}
   */
  static normalize(q, out = new Rotary()) {
    const l = this.magnitude(q)

    if (l === 0) {
      this.identity(out)
    } else {
      const inv = 1 / l

      out.cos = q.cos * inv
      out.sin = q.sin * inv
    }

    return out
  }

  /**
   * @param {number} angle 
   * @param {Rotary} out 
   */
  static rotate(angle, out = new Rotary()) {
    const { cos: cosA, sin: sinA } = out
    const cosB = Math.cos(angle)
    const sinB = Math.sin(angle)

    out.cos = cosA * cosB - sinA * sinB
    out.sin = sinA * cosB + cosA * sinB

    return out
  }

  /**
   * @param {Rotary} rotation1
   * @param {Rotary} rotation2
   * @param {Rotary} out
   */
  static multiply(rotation1, rotation2, out = new Rotary()) {
    const { cos: cosA, sin: sinA } = rotation1
    const { cos: cosB, sin: sinB } = rotation2

    out.cos = cosA * cosB - sinA * sinB
    out.sin = sinA * cosB + cosA * sinB

    return out
  }

  /**
   * @param {Rotary} rotation
   * @param {number} scalar
   * @param {Rotary} out
   */
  static multiplyScalar(rotation, scalar, out = new Rotary()) {
    out.cos = rotation.cos * scalar
    out.sin = rotation.sin * scalar

    return out
  }

  /**
   * @param {Rotary} rotation
   * @param {Rotary} out
   */
  static reverse(rotation, out = new Rotary()) {
    out.cos = -rotation.cos
    out.sin = -rotation.sin

    return out
  }

  /**
   * @param {Rotary} a
   * @param {Rotary} b
   * @returns {number}
   */
  static dot(a, b) {
    return a.cos * b.cos + a.sin * b.sin
  }

  /**
   * @param {Rotary} a
   * @param {Rotary} b
   */
  static angleBetween(a, b) {
    return 2 * Math.acos(Math.abs(clamp(Rotary.dot(a, b), -1, 1)))
  }

  /**
   * @param {number} angle
   * @param {Rotary} out
   * @returns {Rotary}
   */
  static fromAngle(angle, out = new Rotary()) {
    out.cos = Math.cos(angle)
    out.sin = Math.sin(angle)

    return out
  }

  /**
   * @param {Matrix2} matrix 
   * @param {Rotary} out 
   */
  static fromRotationMatrix(matrix, out = new Rotary()) {
    out.cos = matrix.a
    out.sin = matrix.b

    return out
  }

  /**
   * @param {Rotary} out
   */
  static toAngle(out) {
    const angle = Math.acos(out.cos)

    if (out.sin >= 0) {
      return angle
    }

    return TAU - angle
  }

  /**
   * @param {Rotary} rot1
   * @param {Rotary} rot2
   */
  static equal(rot1, rot2) {
    return (
      rot1.cos === rot2.cos &&
      rot1.sin === rot2.sin
    )
  }

  /**
   * @param {Rotary} rot1
   * @param {Rotary} rot2
   * @param {number} [tolerance]
   */
  static fuzzyEqual(rot1, rot2, tolerance) {
    return (
      fuzzyEqual(rot1.cos, rot2.cos, tolerance) &&
      fuzzyEqual(rot1.sin, rot2.sin, tolerance)
    )
  }

  static random() {
    const angle = Math.random() * TAU

    return new Rotary(Math.cos(angle), Math.sin(angle))
  }

  * [Symbol.iterator]() {
    yield this.cos
    yield this.sin
  }

  /**
   * @readonly
   * @type {Rotary}
   */
  static Identity = Rotary.identity()

  /**
   * @readonly
   * @type {Rotary}
   */
  static Zero = Rotary.zero()
}