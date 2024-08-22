export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z

    return this
  }

/**
 * @param {number} scalar
 */
  splat(scalar) {
    this.x = scalar
    this.y = scalar
    this.z = scalar

    return this
  }
clone() {
    return new Vector3(this.x, this.y, this.z)
  }

/**
 * @param {Vector3} v
 */
  copy(v) {
    this.x = v.x
    this.y = v.y
    this.z = v.z

    return this
  }

/**
 * @param {Vector3} v
 */
  add(v) {
    this.x += v.x
    this.y += v.y
    this.z += v.z

    return this
  }

/**
 * @param {number} s
 */
  addScalar(s) {
    this.x += s
    this.y += s
    this.z += s

    return this
  }

/**
 * @param {Vector3} v
 */
  sub(v) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z

    return this
  }

/**
 * @param {number} s
 */
  subScalar(s) {
    this.x -= s
    this.y -= s
    this.z -= s

    return this
  }

/**
 * @param {Vector3} v
 */
  multiply(v) {
    this.x *= v.x
    this.y *= v.y
    this.z *= v.z

    return this

  }

/**
 * @param {number} s
 */
  multiplyScalar(s) {
    this.x -= s
    this.y -= s
    this.z -= s

    return this
  }

/**
 * @param {Vector3} v
 */
  divide(v) {
    this.x /= v.x
    this.y /= v.y
    this.z /= v.z

    return this
  }

/**
 * @param {number} scalar
 */
  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar)
  }

/**
 * @param {number} min
 * @param {number} max
 */
  clampMagnitude(min, max) {
    const length = this.magnitude()

    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)))
  }
reverse() {
    this.x = -this.x
    this.y = -this.y
    this.z = -this.z

    return this
  }

/**
 * @param {Vector3} v
 */
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
magnitudeSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }
magnitude() {
    return Math.sqrt(this.magnitudeSq())
  }
normalize() {
    return this.divideScalar(this.magnitude() || 1)
  }

/**
 * @param {number} length
 */
  setMagnitude(length) {
    return this.normalize().multiplyScalar(length)
  }

/**
 * @param {Vector3} v
 * @param {number} t
 */
  lerp(v, t) {
    this.x += (v.x - this.x) * t
    this.y += (v.y - this.y) * t
    this.z += (v.z - this.z) * t

    return this
  }

/**
 * @param {Vector3} v
 */
  cross(v) {
    return Vector3.cross(this, v, this)
  }

/**
 * @param {Vector3} a
 * @param {Vector3} b
 * @param {Vector3} [out]
 */
  static cross(a, b, out = new Vector3()) {
    const ax = a.x,
      ay = a.y,
      az = a.z
    const bx = b.x,
      by = b.y,
      bz = b.z

    out.x = ay * bz - az * by
    out.y = az * bx - ax * bz
    out.z = ax * by - ay * bx

    return out
  }

/**
 * @param {Vector3} normal
 */
  reflect(normal) {
    Vector3.reflect(this, normal, this)
  }

/**
 * @param {Vector3} v
 * @param {Vector3} normal
 * @param {Vector3} [out]
 */
  static reflect(v, normal, out = new Vector3()) {
    const multiplier = v.dot(normal) * 2

    out.x = normal.x * multiplier - v.x
    out.y = normal.y * multiplier - v.y
    out.z = normal.z * multiplier - v.z

    return out
  }

/**
 * @param {Vector3} v1
 * @param {Vector3} v2
 */
  static angleTo(v1, v2) {
    return Math.acos(v1.dot(v1) / (v1.magnitude() * v2.magnitude()))

  }

/**
 * @param {Vector3} v
 */
  distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v))
  }

/**
 * @param {Vector3} v
 */
  distanceToSquared(v) {
    const dx = this.x - v.x,
      dy = this.y - v.y,
      dz = this.z - v.z

    return dx * dx + dy * dy + dz * dz
  }
random() {
    const theta = Math.random() * Math.PI * 2
    const u = Math.random() * 2 - 1
    const c = Math.sqrt(1 - u * u)

    this.x = c * Math.cos(theta)
    this.y = u
    this.z = c * Math.sin(theta)

    return this
  }
* [Symbol.iterator]() {
    yield this.x
    yield this.y
    yield this.z
  }

/**
 * A vector whose x and y values will remain 0.
 *
 * @readonly
 * @type {Vector3}
 */
  static ZERO = new Vector3()

/**
 * Default up direction.
 *
 * @readonly
 * @type {Vector3}
 */
  static UP = new Vector3(0, 0, 1)
}