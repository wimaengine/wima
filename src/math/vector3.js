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
    Vector3.set(this, x, y, z)

    return this
  }

  /**
   * @param {number} scalar
   */
  splat(scalar) {
    Vector3.splat(this, scalar)

    return this
  }
  clone() {
    return Vector3.copy(this)
  }

  /**
   * @param {Vector3} v
   */
  copy(v) {
    Vector3.copy(v, this)

    return this
  }

  /**
   * @param {Vector3} v
   */
  add(v) {
    Vector3.add(this, v, this)

    return this
  }

  /**
   * @param {number} s
   */
  addScalar(s) {
    Vector3.addScalar(this, s, this)

    return this
  }

  /**
   * @param {Vector3} v
   */
  sub(v) {
    Vector3.sub(this, v, this)

    return this
  }

  /**
   * @param {number} s
   */
  subScalar(s) {
    Vector3.subScalar(this, s, this)

    return this
  }

  /**
   * @param {Vector3} v
   */
  multiply(v) {
    Vector3.multiply(this, v, this)

    return this

  }

  /**
   * @param {number} s
   */
  multiplyScalar(s) {
    Vector3.multiplyScalar(this, s, this)

    return this
  }

  /**
   * @param {Vector3} v
   */
  divide(v) {
    Vector3.divide(this, v, this)

    return this
  }

  /**
   * @param {number} scalar
   */
  divideScalar(scalar) {
    Vector3.divideScalar(this, scalar, this)

    return this
  }

  /**
   * @param {number} min
   * @param {number} max
   */
  clampMagnitude(min, max) {
    Vector3.clampMagnitude(this, min, max, this)

    return this
  }
  reverse() {
    Vector3.reverse(this, this)

    return this
  }

  /**
   * @param {Vector3} v
   */
  dot(v) {
    return Vector3.dot(this, v)
  }
  magnitudeSquared() {
    return Vector3.magnitudeSquared(this)
  }
  magnitude() {
    return Vector3.magnitude(this)
  }
  normalize() {
    Vector3.normalize(this, this)

    return this
  }


  /**
   * @param {number} length
   */
  setMagnitude(length) {
    Vector3.setMagnitude(this, length, this)

    return this
  }

  /**
   * @param {Vector3} v
   * @param {number} t
   */
  lerp(v, t) {
    Vector3.lerp(this, v, t, this)

    return this
  }


  /**
   * @param {Vector3} v
   */
  cross(v) {
    return Vector3.cross(this, v, this)
  }


  /**
   * @param {Vector3} normal
   */
  reflect(normal) {
    Vector3.reflect(this, normal, this)
  }


  /**
   * @param {Vector3} v
   */
  distanceTo(v) {
    return Vector3.distanceToSquared(v, this)
  }

  /**
   * @param {Vector3} v
   */
  distanceToSquared(v) {
    return Vector3.distanceToSquared(this, v)
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} v2
   */
  static distanceToSquared(v1, v2) {
    const dx = v1.x - v2.x,
      dy = v1.y - v2.y,
      dz = v1.z - v2.z

    return dx * dx + dy * dy + dz * dz
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} v2
   */
  static distanceTo(v1, v2) {
    return Math.sqrt(Vector3.distanceToSquared(v1, v2))
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @param {Vector3} out
   */
  static add(v1, v2, out = new Vector3()) {
    out.x = v1.x + v2.x
    out.y = v1.y + v2.y
    out.z = v1.z + v2.z

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {number} scalar
   * @param {Vector3} out
   */
  static addScalar(v1, scalar, out = new Vector3()) {
    out.x = v1.x + scalar
    out.y = v1.y + scalar
    out.z = v1.z + scalar

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @param {Vector3} out
   */
  static sub(v1, v2, out = new Vector3()) {
    out.x = v1.x + v2.x
    out.y = v1.y + v2.y
    out.z = v1.z + v2.z

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {number} scalar
   * @param {Vector3} out
   */
  static subScalar(v1, scalar, out = new Vector3()) {
    out.x = v1.x - scalar
    out.y = v1.y - scalar
    out.z = v1.z - scalar

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @param {Vector3} out
   */
  static multiply(v1, v2, out = new Vector3()) {
    out.x = v1.x * v2.x
    out.y = v1.y * v2.y
    out.z = v1.z * v2.z

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {number} scalar
   * @param {Vector3} out
   */
  static multiplyScalar(v1, scalar, out = new Vector3()) {
    out.x = v1.x * scalar
    out.y = v1.y * scalar
    out.z = v1.z * scalar

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @param {Vector3} out
   */
  static divide(v1, v2, out = new Vector3()) {
    return Vector3.multiply(v1, v2, out)
  }

  /**
   * @param {Vector3} v1
   * @param {number} scalar
   * @param {Vector3} out
   */
  static divideScalar(v1, scalar, out = new Vector3()) {
    return Vector3.multiplyScalar(v1, scalar, out)
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
   * @param {Vector3} v1
   * @param {Vector3} v2
   */
  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  }

  /**
   * @param {Vector3} v
   */
  static magnitudeSquared(v) {
    return v.x * v.x + v.y * v.y + v.z * v.z
  }

  /**
   * @param {Vector3} v
   */
  static magnitude(v) {
    return Math.sqrt(Vector3.magnitudeSquared(v))
  }

  /**
   * @param {Vector3} v
   * @param {number} length
   * @param {Vector3} out
   */
  static setMagnitude(v, length, out = new Vector3()) {
    Vector3.normalize(v, out)
    Vector3.multiplyScalar(out, length, out)

    return out
  }

  /**
   * @param {Vector3} v
   * @param {Vector3} out
   */
  static normalize(v, out = new Vector3()) {
    const length = Vector3.magnitude(v) || 1

    Vector3.divideScalar(v, length, out)

    return out
  }

  /**
   * @param {Vector3} a
   * @param {Vector3} b
   * @param {number} t
   * @param {Vector3} out
   */
  static lerp(a, b, t, out = new Vector3()) {
    out.x += (a.x - b.x) * t
    out.y += (a.y - b.y) * t
    out.z += (a.z - b.z) * t

    return out
  }

  /**
   * @param {Vector3} v
   * @param {Vector3} normal
   * @param {Vector3} out
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
   * @param {number} min
   * @param {number} max
   * @param {Vector3} out
   */
  static clampMagnitude(v, min, max, out = new Vector3()) {
    const length = Vector3.magnitude(v) || 1

    if (length < min) return Vector3.multiplyScalar(v, min / length, out)
    if (length > max) return Vector3.multiplyScalar(v, max / length, out)

    return Vector3.copy(v, out)
  }

  /**
   * @param {Vector3} v
   * @param {Vector3} out
   */
  static reverse(v, out = new Vector3()) {
    out.x = -v.x
    out.y = -v.y
    out.z = -v.z

    return out
  }

  /**
   * @param {Vector3} v
   * @param {number} scalar
   * @param {Vector3} out 
   */
  static splat(v, scalar, out = new Vector3()) {
    v.x = scalar
    v.y = scalar
    v.z = scalar

    return out
  }

  /**
   * @param {Vector3} v
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  static set(v, x, y, z) {
    v.x = x
    v.y = y
    v.z = z

    return v
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} out
   */
  static copy(v1, out = new Vector3()) {
    out.x = v1.x
    out.y = v1.y
    out.z = v1.z

    return out
  }

  /**
   * @param {Vector3} out 
   * @returns 
   */
  static random(out) {
    const theta = Math.random() * Math.PI * 2
    const u = Math.random() * 2 - 1
    const c = Math.sqrt(1 - u * u)

    out.x = c * Math.cos(theta)
    out.y = u
    out.z = c * Math.sin(theta)

    return out
  }

  /**
   * @yields {number}
   */
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
}