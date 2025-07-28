import { invert, lerp } from '../../functions/index.js'

export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  /**
   * Sets x,y and z values of this vector to the given parameter.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  set(x, y, z) {
    Vector3.set(x, y, z, this)

    return this
  }

  /**
   * Copies values of another vector to this vector.
   *
   * @param {Vector3} v
   * @returns {this}
   */
  copy(v) {
    Vector3.copy(v, this)

    return this
  }

  /**
   * Returns a copy of this.
   * @returns {Vector3}
   */
  clone() {
    return Vector3.copy(this)
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  splat(scalar) {
    Vector3.splat(scalar, this)

    return this
  }

  /**
   * Returns the length squared of this vector.
   *
   * @returns {number}
   */
  magnitudeSquared() {
    return Vector3.magnitudeSquared(this)
  }

  /**
   *Returns length of this vector.
   *
   * @returns {number}
   */
  magnitude() {
    return Vector3.magnitude(this)
  }

  /**
   * Returns the distance between this vector and another vector.
   * @param {Vector3} v - The other vector.
   * @returns {number}
   */
  distanceTo(v) {
    return Vector3.distanceTo(this, v)
  }

  /**
   * Returns the squared distance between this vector and another vector.
   *
   * @param {Vector3} v - The other vector.
   * @returns {number}
   */
  distanceToSquared(v) {
    return Vector3.distanceToSquared(this, v)
  }

  /**
   * Makes this a unit vector.
   * @returns {this}
   */
  normalize() {
    Vector3.normalize(this, this)

    return this
  }

  /**
   * Sets this vector to have the given length.
   *
   * @param {number} length
   */
  setMagnitude(length) {
    Vector3.setMagnitude(this, length, this)

    return this
  }

  /**
   * Adds a given vector into this.
   *
   * @param {Vector3} v
   * @returns {this}
   */
  add(v) {
    Vector3.add(this, v, this)

    return this
  }

  /**
   * Adds a scalar value into this vector's component values.
   *
   * @param {number} n
   */
  addScalar(n) {
    Vector3.addScalar(this, n, this)

    return this
  }

  /**
   * Subtracts a given vector from this vector.
   *
   * @param { Vector3} v
   * @returns {this}
   */
  subtract(v) {
    Vector3.subtract(this, v, this)

    return this
  }

  /**
   * Subtracts a scalar value from this vector's component values.
   *
   * @param {number} n
   * @returns {this}
   */
  subtractScalar(n) {
    Vector3.subtractScalar(this, n, this)

    return this
  }

  /**
   * Multiplies this vector with a given vector.
   * @param {Vector3} v
   * @returns {this}
   */
  multiply(v) {
    Vector3.multiply(this, v, this)

    return this
  }

  /**
   * Multiplies a scalar value with this vector's component values.
   * @param {number} s
   * @returns {this}
   */
  multiplyScalar(s) {
    Vector3.multiplyScalar(this, s, this)

    return this
  }

  /**
   * Divides this vector with a scalar.
   *
   * @param {Vector3} v
   * @returns {this}
   */
  divide(v) {
    Vector3.divide(this, v, this)

    return this
  }

  /**
   * @param {number} s
   * @returns {this}
   */
  divideScalar(s) {
    Vector3.divideScalar(this, s, this)

    return this
  }

  /**
   * Calculates the dot product of this with another vector.
   *
   * @param {Vector3} v
   * @returns {number}
   */
  dot(v) {
    return Vector3.dot(this, v)
  }

  /**
   * Calculates the cross product of this with another vector.
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  cross(v) {
    Vector3.cross(this, v, this)

    return this
  }

  /**
   * Negates the values of this vector.
   *
   * @returns {this}
   */
  reverse() {
    Vector3.reverse(this, this)

    return this
  }

  /**
   * @returns {this}
   */
  invert() {
    Vector3.invert(this, this)

    return this
  }

  /**
   * Checks to see if this vector is equal to another vector.
   *
   * @param { Vector3} v
   * @returns {boolean}
   */
  equals(v) {
    return Vector3.equal(this, v)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {Vector3} out
   */
  static set(x, y, z, out = new Vector3()) {
    out.x = x
    out.y = y
    out.z = z

    return out
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
   * @param {number} scalar
   * @param {Vector3} out 
   */
  static splat(scalar, out = new Vector3()) {
    out.x = scalar
    out.y = scalar
    out.z = scalar

    return out
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
   * @param {Vector3} v
   * @param {Vector3} out
   */
  static normalize(v, out = new Vector3()) {
    const length = this.magnitude(v) || 1

    this.divideScalar(v, length, out)

    return out
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
   * @param {Vector3} from
   * @param {Vector3} to
   * @param {Vector3} out
   */
  static subtract(from, to, out = new Vector3()) {
    out.x = from.x - to.x
    out.y = from.y - to.y
    out.z = from.z - to.z

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {number} scalar
   * @param {Vector3} out
   */
  static subtractScalar(v1, scalar, out = new Vector3()) {
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
    out.x = v1.x / v2.x
    out.y = v1.y / v2.y
    out.z = v1.z / v2.z

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {number} scalar
   * @param {Vector3} out
   */
  static divideScalar(v1, scalar, out = new Vector3()) {
    return Vector3.multiplyScalar(v1, 1 / scalar, out)
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
   * @param {Vector3} out
   */
  static invert(v, out = new Vector3()) {
    out.x = invert(v.x)
    out.y = invert(v.y)
    out.z = invert(v.z)

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
   * @param {Vector3} from
   * @param {Vector3} to
   * @param {number} t
   * @param {Vector3} out
   */
  static lerp(from, to, t, out = new Vector3()) {
    out.x = lerp(from.x, to.x, t)
    out.y = lerp(from.y, to.y, t)
    out.z = lerp(from.z, to.z, t)

    return out
  }

  /**
   * @param {Vector3} v
   * @param {Vector3} normal
   * @param {Vector3} out
   */
  static reflect(v, normal, out = new Vector3()) {
    const multiplier = v.dot(normal) * 2

    out.x = v.x - normal.x * multiplier
    out.y = v.y - normal.y * multiplier
    out.z = v.z - normal.z * multiplier

    return out
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} v2
   */
  static angleBetween(v1, v2) {
    return Math.acos(v1.dot(v1) / (v1.magnitude() * v2.magnitude()))
  }

  /**
   * @param {Vector3} v1
   * @param {Vector3} v2
   */
  static equal(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z
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
  static Zero = new Vector3()

  /**
   * Unit vector pointing in the x-axis.
   *
   * @readonly
   * @type {Vector3}
   */
  static X = new Vector3(1, 0, 0)

  /**
   * Unit vector pointing in the y-axis.
   *
   * @readonly
   * @type {Vector3}
   */
  static Y = new Vector3(0, 1, 0)

  /**
   * Unit vector pointing in the z-axis.
   *
   * @readonly
   * @type {Vector3}
   */
  static Z = new Vector3(0, 0, 1)

  /**
   * Unit vector pointing in the negative x-axis.
   *
   * @readonly
   * @type {Vector3}
   */
  static NegX = new Vector3(-1, 0, 0)

  /**
   * Unit vector pointing in the negative y-axis.
   *
   * @readonly
   * @type {Vector3}
   */
  static NegY = new Vector3(0, -1, 0)

  /**
   * Unit vector pointing in the negative z-axis.
   *
   * @readonly
   * @type {Vector3}
   */
  static NegZ = new Vector3(0, 0, -1)
}