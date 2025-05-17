import { Vector3 } from './vector3.js'

/**
 * Represents a 3x3 square matrix.
 * Can br used to represent 3 dimensional rotation, scale and skew.
 * 
 * Row major.
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
  ){
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
   * @param {any} m
   */
  multiply(m) {
    Matrix3.multiply(this, m, this)

    return this
  }

  clone() {
    return Matrix3.copy(this)
  }

  /**
   * @param {Matrix3} matrix
   */
  copy(matrix) {
    Matrix3.copy(matrix, this)

    return this
  }

  /**
   * @param {Matrix3} out
   * @param {number} e11
   * @param {number} e12
   * @param {number} e13
   * @param {number} e21
   * @param {number} e22
   * @param {number} e23
   * @param {number} e31
   * @param {number} e32
   * @param {number} e33
   */
  static set(
    out,
    e11, 
    e12, 
    e13,
    e21, 
    e22, 
    e23,
    e31, 
    e32, 
    e33
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
   * @param {Matrix3} [out= new Matrix3()] 
   * @returns 
   */
  static identity(out = new Matrix3()) {
    Matrix3.set(
      out,
      1, 
      0, 
      0,
      0, 
      1, 
      0,
      0, 
      0, 
      1
    )

    return out
  }

  /**
   * @param {Matrix3} m 
   * @param {Matrix3} [out=new Matrix3()] 
   */
  static copy(m, out = new Matrix3()) {
    out.a = m.a
    out.b = m.b
    out.c = m.c
    out.d = m.d
    out.e = m.e
    out.f = m.f
    out.g = m.g
    out.h = m.h
    out.i = m.i

    return out
  }

  /**
   * @param {Matrix3} a 
   * @param {Matrix3} b 
   * @param {Matrix3} out 
   */
  static multiply(a, b, out = new Matrix3()) {
    const a11 = a.a,
      a12 = a.d,
      a13 = a.g
    const a21 = a.b,
      a22 = a.e,
      a23 = a.h
    const a31 = a.c,
      a32 = a.f,
      a33 = a.i

    const b11 = b.a,
      b12 = b.d,
      b13 = b.g
    const b21 = b.b,
      b22 = b.e,
      b23 = b.h
    const b31 = b.c,
      b32 = b.f,
      b33 = b.i

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
   * @param {Matrix3} m
   * @param {number} s
   * @param {Matrix3} [out=new Matrix3()]
   */
  static multiplyScalar(m, s, out = new Matrix3()) {
    out.a = m.a * s
    out.b = m.b * s
    out.c = m.c * s
    out.d = m.d * s
    out.e = m.e * s
    out.f = m.f * s
    out.g = m.g * s
    out.h = m.h * s
    out.i = m.i * s

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
   * @param {Matrix3} [out=new Matrix3()]
   */
  static invert(matrix, out = new Matrix3()) {
    const
      { a, b, c, d, e, f, g, h, i } = matrix,

      t11 = i * e - h * f,
      t12 = h * c - i * b,
      t13 = f * b - e * c,

      det = a * t11 + d * t12 + g * t13

    if (det === 0) return Matrix3.set(out, 0, 0, 0, 0, 0, 0, 0, 0, 0)

    const detInv = 1 / det

    out.a = t11 * detInv
    out.b = (g * f - i * d) * detInv
    out.c = (h * d - g * e) * detInv

    out.d = t12 * detInv
    out.e = (i * a - g * c) * detInv
    out.f = (g * b - h * a) * detInv

    out.g = t13 * detInv
    out.h = (d * c - f * a) * detInv
    out.i = (e * a - d * b) * detInv

    return out
  }

  /**
   * @param {Matrix3} m
   * @param {Matrix3} [out=new Matrix3()] 
   */
  static transpose(m, out = new Matrix3()) {
    let tmp

    out.a = m.a
    out.e = m.e
    out.i = m.i

    tmp = m.b
    out.b = m.d
    out.d = tmp

    tmp = m.c
    out.c = out.g
    out.g = tmp

    tmp = m.f
    out.f = m.h
    out.h = tmp

    return out
  }

  /**
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   */
  static equals(m1, m2) {
    return (
      m1.a === m2.a &&
      m1.b === m2.b &&
      m1.c === m2.c &&
      m1.d === m2.d &&
      m1.e === m2.e &&
      m1.f === m2.f &&
      m1.g === m2.g &&
      m1.h === m2.h &&
      m1.i === m2.i
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
  }
}