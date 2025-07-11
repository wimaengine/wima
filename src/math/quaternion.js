import { clamp, fuzzyEqual } from './math.js'
import { Matrix3 } from './matrix3.js'
import { Vector3 } from './vector3.js'

export class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  set(x, y, z, w) {
    Quaternion.set(x, y, z, w, this)

    return this
  }

  /**
   * @param {Quaternion} quaternion
   */
  copy(quaternion) {
    Quaternion.copy(quaternion, this)

    return this
  }

  clone() {
    return new Quaternion().copy(this)
  }

  /**
   * @returns {this}
   */
  reverse() {
    Quaternion.reverse(this, this)

    return this
  }

  /**
   * @param {Quaternion} v
   */
  dot(v) {
    return Quaternion.dot(this, v)
  }

  magnitudeSquared() {
    return Quaternion.magnitudeSquared(this)
  }

  magnitude() {
    return Math.sqrt(Quaternion.magnitude(this))
  }

  /**
   * @returns {this}
   */
  normalize() {
    Quaternion.normalize(this, this)

    return this
  }

  /**
   * @param {Quaternion} q
   * @returns {this}
   */
  multiply(q) {
    Quaternion.multiply(this, q, this)

    return this
  }

  /**
   * @param {number} angle
   */
  rotateX(angle) {
    Quaternion.rotateX(angle, this)

    return this
  }

  /**
   * @param {number} angle
   */
  rotateY(angle) {
    Quaternion.rotateY(angle, this)

    return this
  }

  /**
   * @param {number} angle
   */
  rotateZ(angle) {
    Quaternion.rotateZ(angle, this)

    return this
  }

  /**
   * @param {Quaternion} quaternion
   * @returns {boolean}
   */
  equals(quaternion) {
    return Quaternion.equal(this, quaternion)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @param {Quaternion} out
   */
  static set(x, y, z, w, out = new Quaternion()) {
    out.x = x
    out.y = y
    out.z = z
    out.w = w

    return out
  }

  /**
   * @param {Quaternion} from
   * @param {Quaternion} to
   */
  static copy(from, to = new Quaternion()) {
    to.x = from.x
    to.y = from.y
    to.z = from.z
    to.w = from.w

    return to
  }

  /**
   * @param {Quaternion} out
   */
  static identity(out = new Quaternion()) {
    out.x = 0
    out.y = 0
    out.z = 0
    out.w = 1

    return out
  }

  /**
   * @param {Quaternion} out
   */
  static zero(out = new Quaternion()) {
    out.x = 0
    out.y = 0
    out.z = 0
    out.w = 0

    return out
  }

  /**
   * @param {Quaternion} q
   * @returns {number}
   */
  static magnitudeSquared(q) {
    return q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w
  }

  /**
   * @param {Quaternion} q
   * @returns {number}
   */
  static magnitude(q) {
    return Math.sqrt(this.magnitudeSquared(q))
  }

  /**
   * @param {Quaternion} q
   * @param {Quaternion} out
   * @returns {Quaternion}
   */
  static normalize(q, out = new Quaternion()) {
    const l = this.magnitude(q)

    if (l === 0) {
      this.identity(out)
    } else {
      const inv = 1 / l

      out.x = q.x * inv
      out.y = q.y * inv
      out.z = q.z * inv
      out.w = q.w * inv
    }

    return out
  }

  /**
   * @param {number} angle
   * @param {Quaternion} out
   */
  static rotateX(angle, out = new Quaternion()) {
    const halfAngle = angle * 0.5

    const ax = out.x
    const ay = out.y
    const az = out.z
    const aw = out.w

    const bx = Math.sin(halfAngle)
    const bw = Math.cos(halfAngle)

    return this.set(
      ax * bw + aw * bx,
      ay * bw + az * bx,
      az * bw - ay * bx,
      aw * bw - ax * bx,
      out
    )
  }

  /**
   * @param {number} angle
   * @param {Quaternion} out
   */
  static rotateY(angle, out = new Quaternion()) {
    const halfAngle = angle * 0.5

    const ax = out.x
    const ay = out.y
    const az = out.z
    const aw = out.w

    const by = Math.sin(halfAngle)
    const bw = Math.cos(halfAngle)

    return this.set(
      ax * bw - az * by,
      ay * bw + aw * by,
      az * bw + ax * by,
      aw * bw - ay * by,
      out
    )
  }

  /**
   * @param {number} angle
   * @param {Quaternion} out
   */
  static rotateZ(angle, out = new Quaternion()) {
    const halfAngle = angle * 0.5

    const ax = out.x
    const ay = out.y
    const az = out.z
    const aw = out.w

    const bz = Math.sin(halfAngle)
    const bw = Math.cos(halfAngle)

    return this.set(
      ax * bw + ay * bz,
      ay * bw - ax * bz,
      az * bw + aw * bz,
      aw * bw - az * bz,
      out
    )
  }

  /**
   * @param {Quaternion} a
   * @param {Quaternion} b
   * @param {Quaternion} [out]
   * @returns {Quaternion}
   */
  static multiply(a, b, out = new Quaternion()) {
    const qax = a.x,
      qay = a.y,
      qaz = a.z,
      qaw = a.w
    const qbx = b.x,
      qby = b.y,
      qbz = b.z,
      qbw = b.w

    out.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby
    out.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz
    out.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx
    out.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz

    return out
  }

  /**
   * @param {Quaternion} q
   * @param {number} s
   * @param {Quaternion} [out]
   * @returns {Quaternion}
   */
  static multiplyScalar(q, s, out = new Quaternion()) {
    out.x = q.x * s
    out.y = q.y * s
    out.z = q.z * s
    out.w = q.w * s

    return out
  }

  /**
   * @param {Quaternion} a
   * @param {Quaternion} out
   */
  static reverse(a, out = new Quaternion()) {
    out.x = -a.x
    out.y = -a.y
    out.z = -a.z
    out.w = a.w

    return out
  }

  /**
   * @param {Quaternion} q1
   * @param {Quaternion} q2
   * @returns {number}
   */
  static dot(q1, q2) {
    return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w
  }

  /**
   * @param {Quaternion} a
   * @param {Quaternion} b
   */
  static angleBetween(a, b) {
    return 2 * Math.acos(Math.abs(clamp(a.dot(b), -1, 1)))
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {Quaternion} out
   */
  static fromEuler(x, y, z, out = new Quaternion()) {
    const c1 = Math.cos(x / 2)
    const c2 = Math.cos(y / 2)
    const c3 = Math.cos(z / 2)

    const s1 = Math.sin(x / 2)
    const s2 = Math.sin(y / 2)
    const s3 = Math.sin(z / 2)

    out.x = s1 * c2 * c3 + c1 * s2 * s3
    out.y = c1 * s2 * c3 - s1 * c2 * s3
    out.z = c1 * c2 * s3 + s1 * s2 * c3
    out.w = c1 * c2 * c3 - s1 * s2 * s3

    return out
  }

  /**
   * @param {Matrix3} matrix
   * @param {Quaternion} out
   * @returns {Quaternion}
   */
  static fromRotationMatrix(matrix, out = new Quaternion()) {
    const
      m11 = matrix.a,
      m12 = matrix.d,
      m13 = matrix.g,
      m21 = matrix.b,
      m22 = matrix.e,
      m23 = matrix.h,
      m31 = matrix.c,
      m32 = matrix.f,
      m33 = matrix.i,
      trace = matrix.trace()

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0)

      out.w = 0.25 / s
      out.x = (m32 - m23) * s
      out.y = (m13 - m31) * s
      out.z = (m21 - m12) * s
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33)

      out.w = (m32 - m23) / s
      out.x = 0.25 * s
      out.y = (m12 + m21) / s
      out.z = (m13 + m31) / s
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33)

      out.w = (m13 - m31) / s
      out.x = (m12 + m21) / s
      out.y = 0.25 * s
      out.z = (m23 + m32) / s
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22)

      out.w = (m21 - m12) / s
      out.x = (m13 + m31) / s
      out.y = (m23 + m32) / s
      out.z = 0.25 * s
    }

    return out
  }

  /**
   * @param {Vector3} axis
   * @param {number} angle
   * @param {Quaternion} out
   * @returns {Quaternion}
   */
  static fromAxisAngle(axis, angle, out = new Quaternion()) {
    const halfAngle = angle * 0.5,
      s = Math.sin(halfAngle)

    out.x = axis.x * s
    out.y = axis.y * s
    out.z = axis.z * s
    out.w = Math.cos(halfAngle)

    return out
  }

  /**
   * @param {Quaternion} orientation
   * @param {Vector3} vector
   * @returns {Vector3}
   */
  static transformVector3(orientation, vector) {
    const vx = vector.x,
      vy = vector.y,
      vz = vector.z
    const qx = orientation.x,
      qy = orientation.y,
      qz = orientation.z,
      qw = orientation.w

    const tx = 2 * (qy * vz - qz * vy)
    const ty = 2 * (qz * vx - qx * vz)
    const tz = 2 * (qx * vy - qy * vx)

    vector.x = vx + qw * tx + qy * tz - qz * ty
    vector.y = vy + qw * ty + qz * tx - qx * tz
    vector.z = vz + qw * tz + qx * ty - qy * tx

    return vector
  }

  /**
   * @param {Quaternion} a
   * @param {Quaternion} b
   * @param {number} t
   * @param {Quaternion} [out]
   */
  static slerp(a, b, t, out = new Quaternion()) {
    if (t === 0) return out.copy(a)
    if (t === 1) return out.copy(b)

    const { x, y, z, w } = a

    let cosHalfTheta = w * b.w + x * b.x + y * b.y + z * b.z

    if (cosHalfTheta < 0) {
      out.w = -b.w
      out.x = -b.x
      out.y = -b.y
      out.z = -b.z

      cosHalfTheta = -cosHalfTheta
    } else {
      out.copy(b)
    }

    if (cosHalfTheta >= 1.0) {
      out.w = w
      out.x = x
      out.y = y
      out.z = z

      return out
    }

    const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta

    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t

      out.w = s * w + t * out.w
      out.x = s * x + t * out.x
      out.y = s * y + t * out.y
      out.z = s * z + t * out.z
      out.normalize()

      return out
    }

    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta)
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta)
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
      ratioB = Math.sin(t * halfTheta) / sinHalfTheta

    out.w = (w * ratioA + out.w * ratioB)
    out.x = (x * ratioA + out.x * ratioB)
    out.y = (y * ratioA + out.y * ratioB)
    out.z = (z * ratioA + out.z * ratioB)

    return this
  }

  /**
   * @param {Quaternion} a
   * @param {Quaternion} b
   * @returns {boolean}
   */
  static equal(a, b) {
    return (a.x === b.x) && (a.y === b.y) && (a.z === b.z) && (a.w === b.w)
  }

  /**
   * @param {Quaternion} a
   * @param {Quaternion} b
   * @param {number} [tolerance]
   * @returns {boolean}
   */
  static fuzzyEqual(a, b, tolerance) {
    return (
      fuzzyEqual(a.x, b.x, tolerance) &&
      fuzzyEqual(a.y, b.y, tolerance) &&
      fuzzyEqual(a.z, b.z, tolerance) &&
      fuzzyEqual(a.w, b.w, tolerance)
    )
  }

  static random(out = new Quaternion()) {
    const theta1 = 2 * Math.PI * Math.random()
    const theta2 = 2 * Math.PI * Math.random()

    const x0 = Math.random()
    const r1 = Math.sqrt(1 - x0)
    const r2 = Math.sqrt(x0)

    return out.set(
      r1 * Math.sin(theta1),
      r1 * Math.cos(theta1),
      r2 * Math.sin(theta2),
      r2 * Math.cos(theta2)
    )
  }

  * [Symbol.iterator]() {
    yield this.x
    yield this.y
    yield this.z
    yield this.w
  }

  /**
   * @readonly
   * @type {Quaternion}
   */
  static Identity = Quaternion.identity()

  /**
   * @readonly
   * @type {Quaternion}
   */
  static Zero = Quaternion.zero()
}