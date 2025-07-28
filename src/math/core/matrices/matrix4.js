import { invert } from '../functions/index.js'

/**
 * Represents a 4x4 square matrix.
 * Can be used to represent 3 dimensional rotation, scale and skew.
 * 
 * Column major.
 * 
 *  | a | e | i | m |
 *  |---|---|---|---|
 *  | b | f | j | n |
 *  | c | g | k | o |
 *  | d | h | l | p |
 */
export class Matrix4 {

  /**
   * @type {number}
   */
  a = 1

  /**
   * @type {number}
   */
  b = 0

  /**
   * @type {number}
   */
  c = 0

  /**
   * @type {number}
   */
  d = 0

  /**
   * @type {number}
   */
  e = 0

  /**
   * @type {number}
   */
  f = 1

  /**
   * @type {number}
   */
  g = 0

  /**
   * @type {number}
   */
  h = 0

  /**
   * @type {number}
   */
  i = 0

  /**
   * @type {number}
   */
  j = 0

  /**
   * @type {number}
   */
  k = 1

  /**
   * @type {number}
   */
  l = 0

  /**
   * @type {number}
   */
  m = 0

  /**
   * @type {number}
   */
  n = 0

  /**
   * @type {number}
   */
  o = 0

  /**
   * @type {number}
   */
  p = 1

  /**
   * @param {number} n11 
   * @param {number} n12 
   * @param {number} n13 
   * @param {number} n14 
   * @param {number} n21 
   * @param {number} n22 
   * @param {number} n23 
   * @param {number} n24 
   * @param {number} n31 
   * @param {number} n32 
   * @param {number} n33 
   * @param {number} n34 
   * @param {number} n41 
   * @param {number} n42 
   * @param {number} n43 
   * @param {number} n44 
   */
  constructor(
    n11 = 1,
    n12 = 0,
    n13 = 0,
    n14 = 0,
    n21 = 0,
    n22 = 1,
    n23 = 0,
    n24 = 0,
    n31 = 0,
    n32 = 0,
    n33 = 1,
    n34 = 0,
    n41 = 0,
    n42 = 0,
    n43 = 0,
    n44 = 1
  ) {
    Matrix4.set(
      n11,
      n12,
      n13,
      n14,
      n21,
      n22,
      n23,
      n24,
      n31,
      n32,
      n33,
      n34,
      n41,
      n42,
      n43,
      n44,
      this
    )
  }

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e13
   * @param {number} e14
   * @param {number} e21
   * @param {number} e22
   * @param {number} e23
   * @param {number} e24
   * @param {number} e31
   * @param {number} e32
   * @param {number} e33
   * @param {number} e34
   * @param {number} e41
   * @param {number} e42
   * @param {number} e43
   * @param {number} e44
   * @returns {this}
   */
  set(e11, e12, e13, e14, e21, e22, e23, e24, e31, e32, e33, e34, e41, e42, e43, e44) {
    Matrix4.set(e11, e12, e13, e14, e21, e22, e23, e24, e31, e32, e33, e34, e41, e42, e43, e44, this)

    return this
  }

  /**
   * @param {Matrix4} other
   */
  copy(other) {
    Matrix4.copy(other, this)

    return this
  }

  /**
   * @returns {Matrix4}
   */
  clone() {
    return Matrix4.copy(this)
  }

  /**
   * @returns {this}
   */
  transpose() {
    Matrix4.transpose(this, this)

    return this
  }

  /**
   * @returns {number}
   */
  determinant() {
    return Matrix4.determinant(this)
  }

  /**
   * @returns {number}
   */
  trace() {
    return Matrix4.trace(this)
  }

  /**
   * @param {Matrix4} matrix
   * @returns {this}
   */
  add(matrix) {
    Matrix4.add(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  addScalar(scalar) {
    Matrix4.addScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix4} matrix
   * @returns {this}
   */
  subtract(matrix) {
    Matrix4.subtract(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  subtractScalar(scalar) {
    Matrix4.subtractScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix4} matrix
   * @returns {this}
   */
  multiply(matrix) {
    Matrix4.multiply(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  multiplyScalar(scalar) {
    Matrix4.multiplyScalar(this, scalar, this)

    return this
  }

  /**
   * @param {Matrix4} matrix
   * @returns {this}
   */
  divide(matrix) {
    Matrix4.divide(this, matrix, this)

    return this
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  divideScalar(scalar) {
    Matrix4.divideScalar(this, scalar, this)

    return this
  }

  /**
   * @returns {this}
   */
  invert() {
    Matrix4.invert(this, this)

    return this
  }

  /**
   * @param {Matrix4} matrix
   * @returns {boolean}
   */
  equals(matrix) {
    return Matrix4.equal(this, matrix)
  }

  /**
   * @param {number} n11 
   * @param {number} n12 
   * @param {number} n13 
   * @param {number} n14 
   * @param {number} n21 
   * @param {number} n22 
   * @param {number} n23 
   * @param {number} n24 
   * @param {number} n31 
   * @param {number} n32 
   * @param {number} n33 
   * @param {number} n34 
   * @param {number} n41 
   * @param {number} n42 
   * @param {number} n43 
   * @param {number} n44 
   * @param {Matrix4} out 
   * @returns {Matrix4}
   */
  static set(
    n11 = 1,
    n12 = 0,
    n13 = 0,
    n14 = 0,
    n21 = 0,
    n22 = 1,
    n23 = 0,
    n24 = 0,
    n31 = 0,
    n32 = 0,
    n33 = 1,
    n34 = 0,
    n41 = 0,
    n42 = 0,
    n43 = 0,
    n44 = 1,
    out = new Matrix4()
  ) {
    out.a = n11
    out.b = n21
    out.c = n31
    out.d = n41
    out.e = n12
    out.f = n22
    out.g = n32
    out.h = n42
    out.i = n13
    out.j = n23
    out.k = n33
    out.l = n43
    out.m = n14
    out.n = n24
    out.o = n34
    out.p = n44

    return out
  }

  /**
   * @param {Matrix4} matrix
   * @param {Matrix4} out
   * @returns {Matrix4}
   */
  static copy(matrix, out = new Matrix4()) {
    out.a = matrix.a
    out.b = matrix.b
    out.c = matrix.c
    out.d = matrix.d
    out.e = matrix.e
    out.f = matrix.f
    out.g = matrix.g
    out.h = matrix.h
    out.i = matrix.i
    out.j = matrix.j
    out.k = matrix.k
    out.l = matrix.l
    out.m = matrix.m
    out.n = matrix.n
    out.o = matrix.o
    out.p = matrix.p

    return out
  }

  /**
   * @param {Matrix4} matrix 
   * @param {Matrix4} out 
   * @returns {Matrix4}
   */
  static transpose(matrix, out = new Matrix4()) {
    let tmp

    out.a = matrix.a
    out.f = matrix.f
    out.k = matrix.k
    out.p = matrix.p

    tmp = matrix.b
    out.b = matrix.e
    out.e = tmp

    tmp = matrix.c
    out.c = matrix.i
    out.i = tmp

    tmp = matrix.g
    out.g = matrix.j
    out.j = tmp

    tmp = matrix.d
    out.d = matrix.m
    out.m = tmp

    tmp = matrix.h
    out.h = matrix.n
    out.n = tmp

    tmp = matrix.l
    out.l = matrix.o
    out.o = tmp

    return out
  }

  /**
   * @param {Matrix4} out 
   * @returns {Matrix4}
   */
  static identity(out = new Matrix4()) {
    Matrix4.set(
      // eslint-disable function-call
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      out
    )

    return out
  }

  /**
   * @param {Matrix4} out 
   * @returns {Matrix4}
   */
  static zero(out = new Matrix4()) {
    Matrix4.set(
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      out
    )

    return out
  }

  /**
   * @param {Matrix4} matrix 
   * @returns {number}
   */
  static determinant(matrix) {
    const n11 = matrix.a,
      n12 = matrix.e,
      n13 = matrix.i,
      n14 = matrix.m,
      n21 = matrix.b,
      n22 = matrix.f,
      n23 = matrix.j,
      n24 = matrix.n,
      n31 = matrix.c,
      n32 = matrix.g,
      n33 = matrix.k,
      n34 = matrix.o,
      n41 = matrix.d,
      n42 = matrix.h,
      n43 = matrix.l,
      n44 = matrix.p

    return (
      n41 * (
        +n14 * n23 * n32 -
        n13 * n24 * n32 -
        n14 * n22 * n33 +
        n12 * n24 * n33 +
        n13 * n22 * n34 -
        n12 * n23 * n34
      ) +
      n42 * (
        +n11 * n23 * n34 -
        n11 * n24 * n33 +
        n14 * n21 * n33 -
        n13 * n21 * n34 +
        n13 * n24 * n31 -
        n14 * n23 * n31
      ) +
      n43 * (
        +n11 * n24 * n32 -
        n11 * n22 * n34 -
        n14 * n21 * n32 +
        n12 * n21 * n34 +
        n14 * n22 * n31 -
        n12 * n24 * n31
      ) +
      n44 * (
        -n13 * n22 * n31 -
        n11 * n23 * n32 +
        n11 * n22 * n33 +
        n13 * n21 * n32 -
        n12 * n21 * n33 +
        n12 * n23 * n31
      )
    )

  }

  /**
   * @param {Matrix4} matrix 
   * @returns {number}
   */
  static trace(matrix) {
    return matrix.a + matrix.f + matrix.k + matrix.p
  }

  /**
   * @param {Matrix4} matrix1
   * @param {Matrix4} matrix2
   * @param {Matrix4} out
   * @returns {Matrix4}
   */
  static add(matrix1, matrix2, out = new Matrix4()) {
    out.a = matrix1.a + matrix2.a
    out.b = matrix1.b + matrix2.b
    out.c = matrix1.c + matrix2.c
    out.d = matrix1.d + matrix2.d
    out.e = matrix1.e + matrix2.e
    out.f = matrix1.f + matrix2.f
    out.g = matrix1.g + matrix2.g
    out.h = matrix1.h + matrix2.h
    out.i = matrix1.i + matrix2.i
    out.j = matrix1.j + matrix2.j
    out.k = matrix1.k + matrix2.k
    out.l = matrix1.l + matrix2.l
    out.m = matrix1.m + matrix2.m
    out.n = matrix1.n + matrix2.n
    out.o = matrix1.o + matrix2.o
    out.p = matrix1.p + matrix2.p

    return out
  }

  /**
   * @param {Matrix4} matrix
   * @param {number} scalar
   * @param {Matrix4} out
   * @returns {Matrix4}
   */
  static addScalar(matrix, scalar, out = new Matrix4()) {
    out.a = matrix.a + scalar
    out.b = matrix.b + scalar
    out.c = matrix.c + scalar
    out.d = matrix.d + scalar
    out.e = matrix.e + scalar
    out.f = matrix.f + scalar
    out.g = matrix.g + scalar
    out.h = matrix.h + scalar
    out.i = matrix.i + scalar
    out.j = matrix.j + scalar
    out.k = matrix.k + scalar
    out.l = matrix.l + scalar
    out.m = matrix.m + scalar
    out.n = matrix.n + scalar
    out.o = matrix.o + scalar
    out.p = matrix.p + scalar

    return out
  }

  /**
   * @param {Matrix4} matrix1
   * @param {Matrix4} matrix2
   * @param {Matrix4} out
   * @returns {Matrix4}
   */
  static subtract(matrix1, matrix2, out = new Matrix4()) {
    out.a = matrix1.a - matrix2.a
    out.b = matrix1.b - matrix2.b
    out.c = matrix1.c - matrix2.c
    out.d = matrix1.d - matrix2.d
    out.e = matrix1.e - matrix2.e
    out.f = matrix1.f - matrix2.f
    out.g = matrix1.g - matrix2.g
    out.h = matrix1.h - matrix2.h
    out.i = matrix1.i - matrix2.i
    out.j = matrix1.j - matrix2.j
    out.k = matrix1.k - matrix2.k
    out.l = matrix1.l - matrix2.l
    out.m = matrix1.m - matrix2.m
    out.n = matrix1.n - matrix2.n
    out.o = matrix1.o - matrix2.o
    out.p = matrix1.p - matrix2.p

    return out
  }

  /**
   * @param {Matrix4} matrix
   * @param {number} scalar
   * @param {Matrix4} out
   * @returns {Matrix4}
   */
  static subtractScalar(matrix, scalar, out = new Matrix4()) {
    out.a = matrix.a - scalar
    out.b = matrix.b - scalar
    out.c = matrix.c - scalar
    out.d = matrix.d - scalar
    out.e = matrix.e - scalar
    out.f = matrix.f - scalar
    out.g = matrix.g - scalar
    out.h = matrix.h - scalar
    out.i = matrix.i - scalar
    out.j = matrix.j - scalar
    out.k = matrix.k - scalar
    out.l = matrix.l - scalar
    out.m = matrix.m - scalar
    out.n = matrix.n - scalar
    out.o = matrix.o - scalar
    out.p = matrix.p - scalar

    return out
  }

  /**
   * @param {Matrix4} matrix1
   * @param {Matrix4} matrix2
   * @param {Matrix4} out
   * @returns {Matrix4}
   */
  static multiply(matrix1, matrix2, out = new Matrix4()) {
    const
      a11 = matrix1.a,
      a12 = matrix1.e,
      a13 = matrix1.i,
      a14 = matrix1.m,
      a21 = matrix1.b,
      a22 = matrix1.f,
      a23 = matrix1.j,
      a24 = matrix1.n,
      a31 = matrix1.c,
      a32 = matrix1.g,
      a33 = matrix1.k,
      a34 = matrix1.o,
      a41 = matrix1.d,
      a42 = matrix1.h,
      a43 = matrix1.l,
      a44 = matrix1.p

    const
      b11 = matrix2.a,
      b12 = matrix2.e,
      b13 = matrix2.i,
      b14 = matrix2.m,
      b21 = matrix2.b,
      b22 = matrix2.f,
      b23 = matrix2.j,
      b24 = matrix2.n,
      b31 = matrix2.c,
      b32 = matrix2.g,
      b33 = matrix2.k,
      b34 = matrix2.o,
      b41 = matrix2.d,
      b42 = matrix2.h,
      b43 = matrix2.l,
      b44 = matrix2.p

    out.a = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41
    out.e = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42
    out.i = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43
    out.m = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44

    out.b = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41
    out.f = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42
    out.j = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43
    out.n = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44

    out.c = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41
    out.g = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42
    out.k = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43
    out.o = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44

    out.d = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41
    out.h = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42
    out.l = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43
    out.p = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44

    return out
  }

  /**
   * @param {Matrix4} matrix
   * @param {number} scalar
   * @param {Matrix4} out
   * @returns {Matrix4}
   */
  static multiplyScalar(matrix, scalar, out = new Matrix4()) {
    out.a = matrix.a * scalar
    out.b = matrix.b * scalar
    out.c = matrix.c * scalar
    out.d = matrix.d * scalar
    out.e = matrix.e * scalar
    out.f = matrix.f * scalar
    out.g = matrix.g * scalar
    out.h = matrix.h * scalar
    out.i = matrix.i * scalar
    out.j = matrix.j * scalar
    out.k = matrix.k * scalar
    out.l = matrix.l * scalar
    out.m = matrix.m * scalar
    out.n = matrix.n * scalar
    out.o = matrix.o * scalar
    out.p = matrix.p * scalar

    return out
  }

  /**
   * @param {Matrix4} matrix1 
   * @param {Matrix4} matrix2 
   * @param {Matrix4} out 
   */
  static divide(matrix1, matrix2, out = new Matrix4()) {
    const multiplier = this.invert(matrix2)

    this.multiply(matrix1, multiplier, out)

    return out
  }

  /**
   * @param {Matrix4} matrix
   * @param {number} scalar
   * @param {Matrix4} [out=new Matrix4()]
   */
  static divideScalar(matrix, scalar, out = new Matrix4()) {
    this.multiplyScalar(matrix, invert(scalar), out)

    return out
  }

  /**
   * @param {Matrix4} matrix 
   * @param {Matrix4} out 
   * @returns {Matrix4}
   */
  static invert(matrix, out = new Matrix4()) {
    const n11 = matrix.a,
      n21 = matrix.b,
      n31 = matrix.c,
      n41 = matrix.d,
      n12 = matrix.e,
      n22 = matrix.f,
      n32 = matrix.g,
      n42 = matrix.h,
      n13 = matrix.i,
      n23 = matrix.j,
      n33 = matrix.k,
      n43 = matrix.l,
      n14 = matrix.m,
      n24 = matrix.n,
      n34 = matrix.o,
      n44 = matrix.p,

      t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
      t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
      t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
      t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14

    if (det === 0) return Matrix4.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, out)

    const detInv = 1 / det

    out.a = t11 * detInv
    out.b = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv
    out.c = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv
    out.d = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv

    out.e = t12 * detInv
    out.f = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv
    out.g = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv
    out.h = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv

    out.i = t13 * detInv
    out.j = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv
    out.k = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv
    out.l = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv

    out.m = t14 * detInv
    out.n = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv
    out.o = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv
    out.p = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv

    return out
  }

  /**
   * @param {Matrix4} matrix1 
   * @param {Matrix4} matrix2 
   * @returns {boolean}
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
      matrix1.i === matrix2.i &&
      matrix1.j === matrix2.j &&
      matrix1.k === matrix2.k &&
      matrix1.l === matrix2.l &&
      matrix1.m === matrix2.m &&
      matrix1.n === matrix2.n &&
      matrix1.o === matrix2.o &&
      matrix1.p === matrix2.p
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
    yield this.e
    yield this.f
    yield this.g
    yield this.h
    yield this.i
    yield this.j
    yield this.k
    yield this.l
    yield this.m
    yield this.n
    yield this.o
    yield this.p
  }

  /**
   * @type {Matrix4}
   */
  static Identity = Matrix4.identity()

  /**
   * @type {Matrix4}
   */
  static Zero = Matrix4.zero()
}