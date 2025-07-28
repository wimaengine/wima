import { invert, lerp } from '../../functions/index.js'

export class Vector4 {

  /**
   * @type {number}
   */
  x

  /**
   * @type {number}
   */
  y

  /**
   * @type {number}
   */
  z

  /**
   * @type {number}
   */
  w

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {number} w 
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  /**
   * Sets x,y and z values of this vector to the given parameter.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  set(x, y, z, w) {
    Vector4.set(x, y, z, w, this)

    return this
  }

  /**
   * Copies values of another vector to this vector.
   *
   * @param {Vector4} v
   * @returns {this}
   */
  copy(v) {
    Vector4.copy(v, this)

    return this
  }

  /**
   * Returns a copy of this.
   * @returns {Vector4}
   */
  clone() {
    return Vector4.copy(this)
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  splat(scalar) {
    Vector4.splat(scalar, this)

    return this
  }

  /**
   * Returns the length squared of this vector.
   *
   * @returns {number}
   */
  magnitudeSquared() {
    return Vector4.magnitudeSquared(this)
  }

  /**
   *Returns length of this vector.
   *
   * @returns {number}
   */
  magnitude() {
    return Vector4.magnitude(this)
  }

  /**
   * Returns the distance between this vector and another vector.
   * @param {Vector4} v - The other vector.
   * @returns {number}
   */
  distanceTo(v) {
    return Vector4.distanceTo(this, v)
  }

  /**
   * Returns the squared distance between this vector and another vector.
   *
   * @param {Vector4} v - The other vector.
   * @returns {number}
   */
  distanceToSquared(v) {
    return Vector4.distanceToSquared(this, v)
  }

  /**
   * Makes this a unit vector.
   * @returns {this}
   */
  normalize() {
    Vector4.normalize(this, this)

    return this
  }

  /**
   * Sets this vector to have the given length.
   *
   * @param {number} length
   */
  setMagnitude(length) {
    Vector4.setMagnitude(this, length, this)

    return this
  }

  /**
   * Adds a given vector into this.
   *
   * @param {Vector4} v
   * @returns {this}
   */
  add(v) {
    Vector4.add(this, v, this)

    return this
  }

  /**
   * Adds a scalar value into this vector's component values.
   *
   * @param {number} n
   */
  addScalar(n) {
    Vector4.addScalar(this, n, this)

    return this
  }

  /**
   * Subtracts a given vector from this vector.
   *
   * @param { Vector4} v
   * @returns {this}
   */
  subtract(v) {
    Vector4.subtract(this, v, this)

    return this
  }

  /**
   * Subtracts a scalar value from this vector's component values.
   *
   * @param {number} n
   * @returns {this}
   */
  subtractScalar(n) {
    Vector4.subtractScalar(this, n, this)

    return this
  }

  /**
   * Multiplies this vector with a given vector.
   * @param {Vector4} v
   * @returns {this}
   */
  multiply(v) {
    Vector4.multiply(this, v, this)

    return this
  }

  /**
   * Multiplies a scalar value with this vector's component values.
   * @param {number} s
   * @returns {this}
   */
  multiplyScalar(s) {
    Vector4.multiplyScalar(this, s, this)

    return this
  }

  /**
   * Divides this vector with a scalar.
   *
   * @param {Vector4} v
   * @returns {this}
   */
  divide(v) {
    Vector4.divide(this, v, this)

    return this
  }

  /**
   * @param {number} s
   * @returns {this}
   */
  divideScalar(s) {
    Vector4.divideScalar(this, s, this)

    return this
  }

  /**
   * Calculates the dot product of this with another vector.
   *
   * @param {Vector4} v
   * @returns {number}
   */
  dot(v) {
    return Vector4.dot(this, v)
  }

  /**
   * Negates the values of this vector.
   *
   * @returns {this}
   */
  reverse() {
    Vector4.reverse(this, this)

    return this
  }

  /**
   * @returns {this}
   */
  invert() {
    Vector4.invert(this, this)

    return this
  }

  /**
   * Checks to see if this vector is equal to another vector.
   *
   * @param { Vector4} v
   * @returns {boolean}
   */
  equals(v) {
    return Vector4.equal(this, v)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @param {Vector4} out
   */
  static set(x, y, z, w, out = new Vector4()) {
    out.x = x
    out.y = y
    out.z = z
    out.w = w

    return out

  }

  /**
   * @param {Vector4} v
   * @param {Vector4} out
   */
  static copy(v, out = new Vector4()) {
    out.x = v.x
    out.y = v.y
    out.z = v.z
    out.w = v.w

    return out
  }

  /**
   * @param {number} scalar
   * @param {Vector4} out
   */
  static splat(scalar, out = new Vector4()) {
    out.x = scalar
    out.y = scalar
    out.z = scalar
    out.w = scalar

    return out
  }

  /**
   * @param {Vector4} v
   */
  static magnitudeSquared(v) {
    return v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w
  }

  /**
   * @param {Vector4} v 
   */
  static magnitude(v) {
    return Math.sqrt(Vector4.magnitudeSquared(v))
  }

  /**
   * @param {Vector4} v1
   * @param {Vector4} v2
   */
  static distanceToSquared(v1, v2) {
    const dx = v1.x - v2.x,
      dy = v1.y - v2.y,
      dz = v1.z - v2.z,
      dw = v1.w - v2.w

    return dx * dx + dy * dy + dz * dz + dw * dw
  }

  /**
   * @param {Vector4} v1
   * @param {Vector4} v2
   */
  static distanceTo(v1, v2) {
    return Math.sqrt(Vector4.distanceToSquared(v1, v2))
  }

  /**
   * @param {Vector4} v 
   * @param {Vector4} out 
   */
  static normalize(v, out = new Vector4()) {
    const length = this.magnitude(v) || 1

    return this.divideScalar(v, length, out)
  }

  /**
   * @param {Vector4} v
   * @param {number} length
   * @param {Vector4} out
   */
  static setMagnitude(v, length, out = new Vector4()) {
    this.normalize(v, out)
    this.multiplyScalar(out, length, out)

    return out
  }

  /**
   * @param {Vector4} v
   * @param {number} min
   * @param {number} max
   * @param {Vector4} out
   */
  static clampMagnitude(v, min, max, out = new Vector4()) {
    const length = this.magnitude(v) || 1

    if (length < min) return this.multiplyScalar(v, min / length, out)
    if (length > max) return this.multiplyScalar(v, max / length, out)

    return this.copy(v, out)
  }

  /**
   * @param {Vector4} a
   * @param {Vector4} b
   * @param {Vector4} out 
   */
  static add(a, b, out = new Vector4()) {
    out.x = a.x + b.x
    out.y = a.y + b.y
    out.z = a.z + b.z
    out.w = a.w + b.w

    return out

  }

  /**
   * @param {Vector4} v 
   * @param {number} s 
   * @param {Vector4} out 
   */
  static addScalar(v, s, out = new Vector4()) {

    out.x = v.x + s
    out.y = v.y + s
    out.z = v.z + s
    out.w = v.w + s

    return out
  }

  /**
   * @param {Vector4} a
   * @param {Vector4} b
   * @param {Vector4} out
   */
  static subtract(a, b, out = new Vector4()) {
    out.x = a.x - b.x
    out.y = a.y - b.y
    out.z = a.z - b.z
    out.w = a.w - b.w

    return out
  }

  /**
   * @param {Vector4} v 
   * @param {number} s 
   * @param {Vector4} out 
   */
  static subtractScalar(v, s, out = new Vector4()) {
    out.x = v.x - s
    out.y = v.y - s
    out.z = v.z - s
    out.w = v.w - s

    return out
  }

  /** 
   * @param {Vector4} a
   * @param {Vector4} b
   * @param {Vector4} out
   */
  static multiply(a, b, out = new Vector4()) {
    out.x = a.x * b.x
    out.y = a.y * b.y
    out.z = a.z * b.z
    out.w = a.w * b.w

    return out
  }

  /**
   * @param {Vector4} v 
   * @param {number} s 
   * @param {Vector4} out 
   */
  static multiplyScalar(v, s, out = new Vector4()) {
    out.x = v.x * s
    out.y = v.y * s
    out.z = v.z * s
    out.w = v.w * s

    return out
  }

  /**
   * @param {Vector4} a
   * @param {Vector4} b
   * @param {Vector4} out
   */
  static divide(a, b, out = new Vector4()) {
    out.x = a.x / b.x
    out.y = a.y / b.y
    out.z = a.z / b.z
    out.w = a.w / b.w

    return out
  }

  /**
   * @param {Vector4} v
   * @param {number} scalar
   * @param {Vector4} out
   */
  static divideScalar(v, scalar, out = new Vector4()) {
    return Vector4.multiplyScalar(v, 1 / scalar, out)
  }

  /**
   * @param {Vector4} v 
   * @param {Vector4} out 
   */
  static reverse(v, out = new Vector4()) {
    out.x = -v.x
    out.y = -v.y
    out.z = -v.z
    out.w = -v.w

    return out
  }

  /**
   * @param {Vector4} v
   * @param {Vector4} out
   */
  static invert(v, out = new Vector4()) {
    out.x = invert(v.x)
    out.y = invert(v.y)
    out.z = invert(v.z)
    out.w = invert(v.w)

    return out
  }

  /**
   * @param {Vector4} a 
   * @param {Vector4} b 
   * @returns 
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
  }

  /**
   * @param {Vector4} from
   * @param {Vector4} to
   * @param {number} t
   * @param {Vector4} out
   */
  static lerp(from, to, t, out = new Vector4()) {
    out.x = lerp(from.x, to.x, t)
    out.y = lerp(from.y, to.y, t)
    out.z = lerp(from.z, to.z, t)
    out.w = lerp(from.w, to.w, t)

    return out
  }

  /**
   * @param {Vector4} v
   * @param {Vector4} normal
   * @param {Vector4} out
   */
  static reflect(v, normal, out = new Vector4()) {
    const multiplier = v.dot(normal) * 2

    out.x = v.x - normal.x * multiplier
    out.y = v.y - normal.y * multiplier
    out.z = v.z - normal.z * multiplier
    out.w = v.w - normal.w * multiplier

    return out
  }

  /**
   * @param {Vector4} a
   * @param {Vector4} b
   */
  static equal(a, b) {
    return (
      (a.x === b.x) &&
      (a.y === b.y) &&
      (a.z === b.z) &&
      (a.w === b.w)
    )
  }

  static random(out = new Vector4()) {
    out.x = Math.random()
    out.y = Math.random()
    out.z = Math.random()
    out.w = Math.random()

    return out
  }

  /**
   * @yields {number}
   */
  * [Symbol.iterator]() {
    yield this.x
    yield this.y
    yield this.z
    yield this.w
  }

  /**
   * A vector whose components values will remain 0.
   *
   * @readonly
   * @type {Vector4}
   */
  static Zero = new Vector4()

  /**
   * Unit vector pointing in the x-axis.
   *
   * @readonly
   * @type {Vector4}
   */
  static X = new Vector4(1, 0, 0, 0)

  /**
   * Unit vector pointing in the y-axis.
   *
   * @readonly
   * @type {Vector4}
   */
  static Y = new Vector4(0, 1, 0, 0)

  /**
   * Unit vector pointing in the z-axis.
   *
   * @readonly
   * @type {Vector4}
   */
  static Z = new Vector4(0, 0, 1, 0)

  /**
   * Unit vector pointing in the negative w-axis.
   *
   * @readonly
   * @type {Vector4}
   */
  static W = new Vector4(0, 0, 0, 1)

  /**
   * Unit vector pointing in the negative x-axis.
   *
   * @readonly
   * @type {Vector4}
   */
  static NegX = new Vector4(-1, 0, 0, 0)

  /**
   * Unit vector pointing in the negative y-axis.
   *
   * @readonly
   * @type {Vector4}
   */
  static NegY = new Vector4(0, -1, 0, 0)

  /**
   * Unit vector pointing in the negative z-axis.
   *
   * @readonly
   * @type {Vector4}
   */
  static NegZ = new Vector4(0, 0, -1, 0)

  /**
   * Unit vector pointing in the negative w-axis.
   *
   * @readonly
   * @type {Vector4}
   */
  static NegW = new Vector4(0, 0, 0, -1)
}