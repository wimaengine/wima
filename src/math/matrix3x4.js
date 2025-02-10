import { Vector3 } from './vector3.js'
import { Quaternion } from './quaternion.js'
import { Matrix4 } from './matrix4.js'

/**
 * Represents a 3x4 matrix.
 * Can be used to represent 3 dimensional rotation, scale,skew and translation.
 * 
 * 
 *  | a | d | g | j |
 *  |---|---|---|---|
 *  | b | e | h | k |
 *  | c | f | i | l |
 */
export class Matrix3x4 {

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

  /**
   * @type {number}
   */
  j

  /**
   * @type {number}
   */
  k

  /**
   * @type {number}
   */
  l
  constructor(
    e11 = 1, 
    e12 = 0, 
    e13 = 0, 
    e14 = 0,
    e21 = 0, 
    e22 = 1, 
    e23 = 0, 
    e24 = 0,
    e31 = 0, 
    e32 = 0, 
    e33 = 1, 
    e34 = 0
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
    this.j = e14
    this.k = e24
    this.l = e34
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  setPosition(x, y, z) {
    Matrix3x4.setPosition(this, x, y, z)

    return this
  }

  /**
   * @param {Matrix3x4} out
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
   */
  static set(
    out,
    e11, 
    e12, 
    e13, 
    e14,
    e21, 
    e22, 
    e23, 
    e24,
    e31, 
    e32, 
    e33, 
    e34
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
    out.j = e14
    out.k = e24
    out.l = e34
  }

  /**
   * @param {Matrix3x4} out
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  static setPosition(out, x, y, z) {
    out.j = x
    out.k = y
    out.l = z

    return out
  }

  /**
   * @param {Matrix3x4} m
   * @param {Matrix4} out
   * @returns {Matrix4}
   */
  static toMatrix4(m,out = new Matrix4()){
    return Matrix4.set(
      out,
      m.a,m.d,m.g,m.j,
      m.b,m.e,m.h,m.k,
      m.c,m.f,m.i,m.l,
      0,0,0,1
    )
  }

  /**
   * @param {Matrix3x4} m
   * @param {Vector3} target
   * @param {Vector3} up
   * @param {Matrix3x4} out
   */
  static lookAt(m, target, up, out = new Matrix3x4()) {
    const eye = new Vector3(m.j, m.k, m.l)
    const x = new Vector3()
    const y = new Vector3()
    const z = new Vector3()

    Vector3.sub(eye, target, z)

    if (Vector3.magnitudeSquared(z) === 0) {
      z.z = 1
    }

    Vector3.normalize(z, z)
    Vector3.cross(up, z, x)

    if (Vector3.magnitudeSquared(x) === 0) {
      if (Math.abs(up.z) === 1) {
        z.x += 0.0001
      } else {
        z.z += 0.0001
      }

      Vector3.normalize(z, z)
      Vector3.cross(up, x, z)
    }

    Vector3.normalize(x, x)
    Vector3.cross(z, x, y)

    out.a = x.x
    out.b = x.y
    out.c = x.z
    out.d = y.x
    out.e = y.y
    out.f = y.z
    out.g = z.x
    out.h = z.y
    out.i = z.z
    out.j = eye.x
    out.k = eye.y
    out.l = eye.z

    return out
  }

  /**
   * @param {Vector3} position
   * @param {Quaternion} quaternion
   * @param {Vector3} scale
   * @param {Matrix3x4} out
   */
  static compose(position, quaternion, scale, out = new Matrix3x4()) {
    const { x, y, z, w } = quaternion
    const x2 = x + x,
      y2 = y + y,
      z2 = z + z
    const xx = x * x2,
      xy = x * y2,
      xz = x * z2
    const yy = y * y2,
      yz = y * z2,
      zz = z * z2
    const wx = w * x2,
      wy = w * y2,
      wz = w * z2

    const sx = scale.x,
      sy = scale.y,
      sz = scale.z

    out.a = (1 - (yy + zz)) * sx
    out.b = (xy + wz) * sx
    out.c = (xz - wy) * sx

    out.d = (xy - wz) * sy
    out.e = (1 - (xx + zz)) * sy
    out.f = (yz + wx) * sy

    out.g = (xz + wy) * sz
    out.h = (yz - wx) * sz
    out.i = (1 - (xx + yy)) * sz

    out.j = position.x
    out.k = position.y
    out.l = position.z

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
    yield this.j
    yield this.k
    yield this.l
  }
}