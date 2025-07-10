import { invert } from './math.js'

/**
 * Represents a 2x2 matrix.
 *
 *  | a | c |
 *  |---|---|
 *  | b | d |
 */
export class Matrix2 {

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
   * @param {number} e11
   * @param {number} e12
   * @param {number} e21
   * @param {number} e22
   */
  constructor(e11 = 1, e12 = 0, e21 = 0, e22 = 1) {
    this.a = e11
    this.b = e21
    this.c = e12
    this.d = e22
  }

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e21
   * @param {number} e22
   * @returns {this}
   */
  set(e11, e12, e21, e22) {
    Matrix2.set(e11, e12, e21, e22, this)

    return this
  }

  /**
   * @param {Matrix2} other
   */
  copy(other) {
    Matrix2.copy(other, this)

    return this
  }

  /**
   * @returns {Matrix2}
   */
  clone() {
    return Matrix2.copy(this)
  }

  /**
   * @returns {this}
   */
  transpose() {
    Matrix2.transpose(this, this)

    return this
  }

  /**
   * @returns {number}
   */
  determinant() {
    return Matrix2.determinant(this)
  }

  /**
   * @returns {number}
   */
  trace() {
    return Matrix2.trace(this)
  }

  /**
   * @param {Matrix2} matrix
   * @returns {this}
   */
  add(matrix) {
    Matrix2.add(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  addScalar(scalar) {
    Matrix2.addScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix2} matrix
   * @returns {this}
   */
  subtract(matrix) {
    Matrix2.subtract(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  subtractScalar(scalar) {
    Matrix2.subtractScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix2} matrix
   * @returns {this}
   */
  multiply(matrix) {
    Matrix2.multiply(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  multiplyScalar(scalar) {
    Matrix2.multiplyScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix2} matrix
   * @returns {this}
   */
  divide(matrix) {
    Matrix2.divide(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  divideScalar(scalar) {
    Matrix2.divideScalar(this, scalar, this)

    return this
  }

  /**
   * @returns {this}
   */
  invert() {
    Matrix2.invert(this)

    return this
  }

  /**
   * @param {Matrix2} matrix
   * @returns {boolean}
   */
  equals(matrix) {
    return Matrix2.equal(this, matrix)
  }

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e21
   * @param {number} e22
   * @param {Matrix2} out
   */
  static set(e11, e12, e21, e22, out = new Matrix2()) {
    out.a = e11
    out.b = e21
    out.c = e12
    out.d = e22

    return out
  }

  /**
   * @param {Matrix2} matrix
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static copy(matrix, out = new Matrix2()) {
    out.a = matrix.a
    out.b = matrix.b
    out.c = matrix.c
    out.d = matrix.d

    return out
  }

  /**
   * @param {Matrix2} matrix 
   * @param {Matrix2} out 
   * @returns {Matrix2}
   */
  static transpose(matrix, out = new Matrix2()) {
    const { b } = matrix

    out.a = matrix.a
    out.b = matrix.c
    out.c = b
    out.d = matrix.d

    return out
  }

  /**
   * @param {Matrix2} out 
   * @returns {Matrix2}
   */
  static identity(out = new Matrix2()) {
    this.set(1, 0, 0, 1, out)

    return out
  }

  /**
   * @param {Matrix2} out 
   * @returns {Matrix2}
   */
  static zero(out = new Matrix2()) {
    this.set(0, 0, 0, 0, out)

    return out
  }

  /**
   * @param {Matrix2} matrix 
   * @returns {number}
   */
  static determinant(matrix) {
    return matrix.a * matrix.d - matrix.c * matrix.b
  }

  /**
   * @param {Matrix2} matrix 
   * @returns {number}
   */
  static trace(matrix) {
    return matrix.a + matrix.d
  }

  /**
   * @param {Matrix2} matrix1
   * @param {Matrix2} matrix2
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static add(matrix1, matrix2, out = new Matrix2()) {
    out.a = matrix1.a + matrix2.a
    out.b = matrix1.b + matrix2.b
    out.c = matrix1.c + matrix2.c
    out.d = matrix1.d + matrix2.d

    return out
  }

  /**
   * @param {Matrix2} matrix
   * @param {number} scalar
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static addScalar(matrix, scalar, out = new Matrix2()) {
    out.a = matrix.a + scalar
    out.b = matrix.b + scalar
    out.c = matrix.c + scalar
    out.d = matrix.d + scalar

    return out
  }

  /**
   * @param {Matrix2} matrix1
   * @param {Matrix2} matrix2
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static subtract(matrix1, matrix2, out = new Matrix2()) {
    out.a = matrix1.a - matrix2.a
    out.b = matrix1.b - matrix2.b
    out.c = matrix1.c - matrix2.c
    out.d = matrix1.d - matrix2.d

    return out
  }

  /**
   * @param {Matrix2} matrix
   * @param {number} scalar
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static subtractScalar(matrix, scalar, out = new Matrix2()) {
    out.a = matrix.a - scalar
    out.b = matrix.b - scalar
    out.c = matrix.c - scalar
    out.d = matrix.d - scalar

    return out
  }

  /**
   * @param {Matrix2} matrix1 
   * @param {Matrix2} matrix2 
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static multiply(matrix1, matrix2, out = new Matrix2()) {
    const { a: aa, b: ab, c: ac, d: ad } = matrix1
    const { a: ba, b: bb, c: bc, d: bd } = matrix2

    out.a = aa * ba + ac * bb
    out.b = ab * ba + ad * bb
    out.c = aa * bc + ac * bd
    out.d = ab * bc + ad * bd

    return out
  }

  /**
   * @param {Matrix2} matrix
   * @param {number} scalar
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static multiplyScalar(matrix, scalar, out = new Matrix2()) {
    out.a = matrix.a * scalar
    out.b = matrix.b * scalar
    out.c = matrix.c * scalar
    out.d = matrix.d * scalar

    return out
  }

  /**
   * @param {Matrix2} matrix1
   * @param {Matrix2} matrix2
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static divide(matrix1, matrix2, out = new Matrix2()) {
    const multiplier = this.invert(matrix2)

    this.multiply(matrix1, multiplier, out)

    return out
  }

  /**
   * @param {Matrix2} matrix
   * @param {number} scalar
   * @param {Matrix2} out
   * @returns {Matrix2}
   */
  static divideScalar(matrix, scalar, out = new Matrix2()) {
    this.multiplyScalar(matrix, invert(scalar), out)

    return out
  }

  /**
   * @param {Matrix2} matrix 
   * @param {Matrix2} out 
   * @returns {Matrix2}
   */
  static invert(matrix, out = new Matrix2()) {
    const { a, b, c, d } = matrix
    const det = this.determinant(matrix)

    if (det === 0) {
      return this.zero(out)
    }

    const detInv = invert(det)

    out.a = detInv * d
    out.b = detInv * -b
    out.c = detInv * -c
    out.d = detInv * a

    return out
  }

  /**
   * @param {Matrix2} matrix1 
   * @param {Matrix2} matrix2 
   * @returns {boolean}
   */
  static equal(matrix1, matrix2) {
    return (
      matrix1.a === matrix2.a ||
      matrix1.b === matrix2.b ||
      matrix1.c === matrix2.c ||
      matrix1.d === matrix2.d
    )
  }

  /**
   * Allows iteration of components.
   *
   * @yields {number}
   */
  * [Symbol.iterator]() {
    yield this.a
    yield this.b
    yield this.c
    yield this.d
  }

  /**
   * @type {Matrix2}
   */
  static Identity = Matrix2.identity()

  /**
   * @type {Matrix2}
   */
  static Zero = Matrix2.zero()
}