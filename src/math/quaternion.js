import { clamp } from './math.js'
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
    this.x = x
    this.y = y
    this.z = z
    this.w = w

    return this
  }
  clone() {
    return new Quaternion().copy(this)
  }

  /**
   * @param {Quaternion} quaternion
   */
  copy(quaternion) {
    this.x = quaternion.x
    this.y = quaternion.y
    this.z = quaternion.z
    this.w = quaternion.w

    return this
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  fromEuler(x, y, z) {
    Quaternion.fromEuler(x, y, z, this)
    
    return this
  }

  /**
   * @param {Vector3} axis
   * @param {number} angle
   */
  setFromAxisAngle(axis, angle) {
    const halfAngle = angle / 2,
      s = Math.sin(halfAngle)

    this.x = axis.x * s
    this.y = axis.y * s
    this.z = axis.z * s
    this.w = Math.cos(halfAngle)

    return this
  }

  /**
   * @param {Quaternion} q
   */
  angleTo(q) {
    return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)))
  }
  identity() {
    this.x = 0
    this.y = 0
    this.z = 0
    this.w = 1

    return this
  }
  invert() {
    return this.conjugate()
  }
  conjugate() {
    this.x *= -1
    this.y *= -1
    this.z *= -1

    return this
  }

  /**
   * @param {Quaternion} v
   */
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w
  }
  magnitudeSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
  }
  magnitude() {
    return Math.sqrt(this.magnitudeSq())
  }
  normalize() {
    const l = this.magnitude()

    if (l === 0) {
      this.x = 0
      this.y = 0
      this.z = 0
      this.w = 1

    } else {
      const inv = 1 / l

      this.x = this.x * inv
      this.y = this.y * inv
      this.z = this.z * inv
      this.w = this.w * inv
    }

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
   * @param {Quaternion} qa
   * @param {Quaternion} qb
   * @param {number} t
   * @param {Quaternion} [out]
   */
  static slerp(qa, qb, t, out = new Quaternion()) {
    if (t === 0) return out.copy(qa)
    if (t === 1) return out.copy(qb)

    const { x, y, z, w } = qa

    let cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z

    if (cosHalfTheta < 0) {
      out.w = -qb.w
      out.x = -qb.x
      out.y = -qb.y
      out.z = -qb.z

      cosHalfTheta = -cosHalfTheta
    } else {
      out.copy(qb)
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
  random() {
    const theta1 = 2 * Math.PI * Math.random()
    const theta2 = 2 * Math.PI * Math.random()

    const x0 = Math.random()
    const r1 = Math.sqrt(1 - x0)
    const r2 = Math.sqrt(x0)

    return this.set(
      r1 * Math.sin(theta1),
      r1 * Math.cos(theta1),
      r2 * Math.sin(theta2),
      r2 * Math.cos(theta2)
    )
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
   * @param {Quaternion} quaternion
   * @returns {boolean}
   */
  equals(quaternion) {
    return (quaternion.x === this.x) && (quaternion.y === this.y) && (quaternion.z === this.z) && (quaternion.w === this.w)
  }

  /**
   * @param {Quaternion} q
   * @param {Vector3} v
   * @returns {Vector3}
   */
  static transformVector3(q, v) {
    const vx = v.x,
      vy = v.y,
      vz = v.z
    const qx = q.x,
      qy = q.y,
      qz = q.z,
      qw = q.w

    const tx = 2 * (qy * vz - qz * vy)
    const ty = 2 * (qz * vx - qx * vz)
    const tz = 2 * (qx * vy - qy * vx)

    v.x = vx + qw * tx + qy * tz - qz * ty
    v.y = vy + qw * ty + qz * tx - qx * tz
    v.z = vz + qw * tz + qx * ty - qy * tx

    return v
  }
  
  * [Symbol.iterator]() {
    yield this.x
    yield this.y
    yield this.z
    yield this.w
  }
}