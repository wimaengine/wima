import { invert } from './math.js'
import { Vector3 } from './vector3.js'

/**
 * Represents a 3x3 square matrix.
 * Can br used to represent 3 dimensional rotation, scale and skew.
 * 
 * Column major.
 * 
 *  | a | d | g |
 *  |---|---|---|
 *  | b | e | h |
 *  | c | f | i |
 */
export class Matrix3 {

  /**
   * @type {number}
   */
  a

  /**
   * @type {number}
   */
  b

  /**
   * @type {number}
   */
  c

  /**
   * @type {number}
   */
  d

  /**
   * @type {number}
   */
  e

  /**
   * @type {number}
   */
  f

  /**
   * @type {number}
   */
  g

  /**
   * @type {number}
   */
  h

  /**
   * @type {number}
   */
  i
  constructor(
    e11 = 1,
    e12 = 0,
    e13 = 0,
    e21 = 0,
    e22 = 1,
    e23 = 0,
    e31 = 0,
    e32 = 0,
    e33 = 1
  ) {
    this.a = e11
    this.b = e21
    this.c = e31
    this.d = e12
    this.e = e22
    this.f = e32
    this.g = e13
    this.h = e23
    this.i = e33
  }

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e13
   * @param {number} e21
   * @param {number} e22
   * @param {number} e23
   * @param {number} e31
   * @param {number} e32
   * @param {number} e33
   * @returns {this}
   */
  set(e11, e12, e13, e21, e22, e23, e31, e32, e33) {
    Matrix3.set(e11, e12, e13, e21, e22, e23, e31, e32, e33, this)

    return this
  }

  /**
   * @param {Matrix3} other
   */
  copy(other) {
    Matrix3.copy(other, this)

    return this
  }

  /**
   * @returns {Matrix3}
   */
  clone() {
    return Matrix3.copy(this)
  }

  /**
   * @returns {this}
   */
  transpose() {
    Matrix3.transpose(this, this)

    return this
  }

  /**
   * @returns {number}
   */
  determinant() {
    return Matrix3.determinant(this)
  }

  /**
   * @returns {number}
   */
  trace() {
    return Matrix3.trace(this)
  }

  /**
   * @param {Matrix3} matrix
   * @returns {this}
   */
  add(matrix) {
    Matrix3.add(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  addScalar(scalar) {
    Matrix3.addScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix3} matrix
   * @returns {this}
   */
  subtract(matrix) {
    Matrix3.subtract(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  subtractScalar(scalar) {
    Matrix3.subtractScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix3} matrix
   * @returns {this}
   */
  multiply(matrix) {
    Matrix3.multiply(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  multiplyScalar(scalar) {
    Matrix3.multiplyScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix3} matrix
   * @returns {this}
   */
  divide(matrix) {
    Matrix3.divide(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  divideScalar(scalar) {
    Matrix3.divideScalar(this, scalar, this)

    return this
  }

  /**
   * @returns {this}
   */
  invert() {
    Matrix3.invert(this)

    return this
  }

  /**
   * @param {Matrix3} matrix
   * @returns {boolean}
   */
  equals(matrix) {
    return Matrix3.equal(this, matrix)
  }

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e13
   * @param {number} e21
   * @param {number} e22
   * @param {number} e23
   * @param {number} e31
   * @param {number} e32
   * @param {number} e33
   * @param {Matrix3} out
   */
  static set(
    e11,
    e12,
    e13,
    e21,
    e22,
    e23,
    e31,
    e32,
    e33,
    out = new Matrix3()
  ) {
    out.a = e11
    out.b = e21
    out.c = e31
    out.d = e12
    out.e = e22
    out.f = e32
    out.g = e13
    out.h = e23
    out.i = e33

    return out
  }

  /**
   * @param {Matrix3} matrix 
   * @param {Matrix3} [out=new Matrix3()] 
   */
  static copy(matrix, out = new Matrix3()) {
    out.a = matrix.a
    out.b = matrix.b
    out.c = matrix.c
    out.d = matrix.d
    out.e = matrix.e
    out.f = matrix.f
    out.g = matrix.g
    out.h = matrix.h
    out.i = matrix.i

    return out
  }

  /**
   * @param {Matrix3} matrix
   * @param {Matrix3} [out=new Matrix3()] 
   */
  static transpose(matrix, out = new Matrix3()) {
    const { a, b, c, d, e, f, g, h, i } = matrix

    out.a = a
    out.b = d
    out.c = g
    out.d = b
    out.e = e
    out.f = h
    out.g = c
    out.h = f
    out.i = i

    return out
  }

  /**
   * @param {Matrix3} [out= new Matrix3()] 
   * @returns 
   */
  static identity(out = new Matrix3()) {
    Matrix3.set(1, 0, 0, 0, 1, 0, 0, 0, 1, out)

    return out
  }

  /**
   * @param {Matrix3} out 
   * @returns {Matrix3}
   */
  static zero(out = new Matrix3()) {
    Matrix3.set(0, 0, 0, 0, 0, 0, 0, 0, 0, out)

    return out
  }

  /**
   * @param {Matrix3} matrix
   */
  static determinant(matrix) {
    return matrix.a * matrix.e * matrix.i - matrix.a * matrix.f * matrix.h - matrix.b * matrix.d * matrix.i + matrix.b * matrix.f * matrix.g + matrix.c * matrix.d * matrix.h - matrix.c * matrix.e * matrix.g
  }

  /**
   * @param {Matrix3} matrix 
   * @returns {number}
   */
  static trace(matrix) {
    return matrix.a + matrix.e + matrix.i
  }

  /**
   * @param {Matrix3} matrix1
   * @param {Matrix3} matrix2
   * @param {Matrix3} out
   * @returns {Matrix3}
   */
  static add(matrix1, matrix2, out = new Matrix3()) {
    out.a = matrix1.a + matrix2.a
    out.b = matrix1.b + matrix2.b
    out.c = matrix1.c + matrix2.c
    out.d = matrix1.d + matrix2.d
    out.e = matrix1.e + matrix2.e
    out.f = matrix1.f + matrix2.f
    out.g = matrix1.g + matrix2.g
    out.h = matrix1.h + matrix2.h
    out.i = matrix1.i + matrix2.i

    return out
  }

  /**
   * @param {Matrix3} matrix
   * @param {number} scalar
   * @param {Matrix3} out
   * @returns {Matrix3}
   */
  static addScalar(matrix, scalar, out = new Matrix3()) {
    out.a = matrix.a + scalar
    out.b = matrix.b + scalar
    out.c = matrix.c + scalar
    out.d = matrix.d + scalar
    out.e = matrix.e + scalar
    out.f = matrix.f + scalar
    out.g = matrix.g + scalar
    out.h = matrix.h + scalar
    out.i = matrix.i + scalar

    return out
  }

  /**
   * @param {Matrix3} matrix1
   * @param {Matrix3} matrix2
   * @param {Matrix3} out
   * @returns {Matrix3}
   */
  static subtract(matrix1, matrix2, out = new Matrix3()) {
    out.a = matrix1.a - matrix2.a
    out.b = matrix1.b - matrix2.b
    out.c = matrix1.c - matrix2.c
    out.d = matrix1.d - matrix2.d
    out.e = matrix1.e - matrix2.e
    out.f = matrix1.f - matrix2.f
    out.g = matrix1.g - matrix2.g
    out.h = matrix1.h - matrix2.h
    out.i = matrix1.i - matrix2.i

    return out
  }

  /**
   * @param {Matrix3} matrix
   * @param {number} scalar
   * @param {Matrix3} out
   * @returns {Matrix3}
   */
  static subtractScalar(matrix, scalar, out = new Matrix3()) {
    out.a = matrix.a - scalar
    out.b = matrix.b - scalar
    out.c = matrix.c - scalar
    out.d = matrix.d - scalar
    out.e = matrix.e - scalar
    out.f = matrix.f - scalar
    out.g = matrix.g - scalar
    out.h = matrix.h - scalar
    out.i = matrix.i - scalar

    return out
  }

  /**
   * @param {Matrix3} matrix1 
   * @param {Matrix3} matrix2 
   * @param {Matrix3} out 
   */
  static multiply(matrix1, matrix2, out = new Matrix3()) {
    const a11 = matrix1.a,
      a12 = matrix1.d,
      a13 = matrix1.g
    const a21 = matrix1.b,
      a22 = matrix1.e,
      a23 = matrix1.h
    const a31 = matrix1.c,
      a32 = matrix1.f,
      a33 = matrix1.i

    const b11 = matrix2.a,
      b12 = matrix2.d,
      b13 = matrix2.g
    const b21 = matrix2.b,
      b22 = matrix2.e,
      b23 = matrix2.h
    const b31 = matrix2.c,
      b32 = matrix2.f,
      b33 = matrix2.i

    out.a = a11 * b11 + a12 * b21 + a13 * b31
    out.d = a11 * b12 + a12 * b22 + a13 * b32
    out.g = a11 * b13 + a12 * b23 + a13 * b33

    out.b = a21 * b11 + a22 * b21 + a23 * b31
    out.e = a21 * b12 + a22 * b22 + a23 * b32
    out.h = a21 * b13 + a22 * b23 + a23 * b33

    out.c = a31 * b11 + a32 * b21 + a33 * b31
    out.f = a31 * b12 + a32 * b22 + a33 * b32
    out.i = a31 * b13 + a32 * b23 + a33 * b33

    return out
  }

  /**
   * @param {Matrix3} matrix
   * @param {number} scalar
   * @param {Matrix3} [out=new Matrix3()]
   */
  static multiplyScalar(matrix, scalar, out = new Matrix3()) {
    out.a = matrix.a * scalar
    out.b = matrix.b * scalar
    out.c = matrix.c * scalar
    out.d = matrix.d * scalar
    out.e = matrix.e * scalar
    out.f = matrix.f * scalar
    out.g = matrix.g * scalar
    out.h = matrix.h * scalar
    out.i = matrix.i * scalar

    return out
  }

  /**
   * @param {Matrix3} matrix1 
   * @param {Matrix3} matrix2 
   * @param {Matrix3} out 
   */
  static divide(matrix1, matrix2, out = new Matrix3()) {
    const multiplier = this.invert(matrix2)

    this.multiply(matrix1, multiplier, out)

    return out
  }

  /**
   * @param {Matrix3} matrix
   * @param {number} scalar
   * @param {Matrix3} [out=new Matrix3()]
   */
  static divideScalar(matrix, scalar, out = new Matrix3()) {
    this.multiplyScalar(matrix, invert(scalar), out)

    return out
  }

  /**
   * @param {Matrix3} matrix
   * @param {Matrix3} [out=new Matrix3()]
   */
  static invert(matrix, out = new Matrix3()) {
    const
      { a, b, c, d, e, f, g, h, i } = matrix,

      t11 = i * e - h * f,
      t12 = h * c - i * b,
      t13 = f * b - e * c,

      det = a * t11 + d * t12 + g * t13

    if (det === 0) return Matrix3.zero(out)

    const detInv = invert(det)

    out.a = t11 * detInv
    out.b = t12 * detInv
    out.c = t13 * detInv
    out.d = (g * f - i * d) * detInv
    out.e = (i * a - g * c) * detInv
    out.f = (d * c - f * a) * detInv
    out.g = (h * d - g * e) * detInv
    out.h = (g * b - h * a) * detInv
    out.i = (e * a - d * b) * detInv

    return out
  }

  /**
   * @param {Matrix3} matrix1
   * @param {Matrix3} matrix2
   */
  static equal(matrix1, matrix2) {
    return (
      matrix1.a === matrix2.a &&
      matrix1.b === matrix2.b &&
      matrix1.c === matrix2.c &&
      matrix1.d === matrix2.d &&
      matrix1.e === matrix2.e &&
      matrix1.f === matrix2.f &&
      matrix1.g === matrix2.g &&
      matrix1.h === matrix2.h &&
      matrix1.i === matrix2.i
    )
  }

  /**
   * @param {Vector3} euler
   * @param {Matrix3} [out=new Matrix3()]
   */
  static fromEuler(euler, out = new Matrix3()) {
    const { x } = euler,
      { y } = euler,
      { z } = euler
    const a = Math.cos(x),
      b = Math.sin(x)
    const c = Math.cos(y),
      d = Math.sin(y)
    const e = Math.cos(z),
      f = Math.sin(z)
    const ae = a * e,
      af = a * f,
      be = b * e,
      bf = b * f

    out.a = c * e
    out.d = -c * f
    out.g = d

    out.b = af + be * d
    out.e = ae - bf * d
    out.h = -b * c

    out.c = bf - ae * d
    out.f = be + af * d
    out.i = a * c

    return out
  }

  /**
   * Allows iteration of components.
   *
   * @yields {number}
   */
  *[Symbol.iterator]() {
    yield this.a
    yield this.b
    yield this.c
    yield this.d
    yield this.e
    yield this.f
    yield this.g
    yield this.h
    yield this.i
  }

  /**
   * @type {Matrix3}
   */
  static Identity = Matrix3.identity()

  /**
   * @type {Matrix3}
   */
  static Zero = Matrix3.zero()
}