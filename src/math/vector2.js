import { TAU } from './constants.js'
import { invert, lerp } from './math.js'

/**
 * This is a 2D vector class.
 *
 */
export class Vector2 {

  /**
   * @param {number} [x] - The x coordinate of the vector.
   * @param {number} [y] - The y coordinate of the vector.
   */
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /**
   * Sets values of this vector.
   *
   * @param {number} x
   * @param {number} y
   */
  set(x, y) {
    Vector2.set(x, y, this)

    return this
  }

  /**
   * Copies values of another vector to this vector.
   *
   * @param { Vector2} v
   * @returns {this}
   */
  copy(v) {
    Vector2.copy(v, this)

    return this
  }

  /**
   * Returns a copy of this.
   * @returns {Vector2}
   */
  clone() {
    return Vector2.copy(this)
  }

  /**
   * @param {number} scalar
   * @returns {this}
   */
  splat(scalar) {
    Vector2.splat(scalar, this)

    return this
  }

  /**
   * Returns the length squared of this vector.
   *
   * @returns {number}
   */
  magnitudeSquared() {
    return Vector2.magnitudeSquared(this)
  }

  /**
   *Returns length of this vector.
   *
   * @returns {number}
   */
  magnitude() {
    return Vector2.magnitude(this)
  }

  /**
   * Returns the distance between this vector and another vector.
   * @param {Vector2} v - The other vector.
   * @returns {number}
   */
  distanceTo(v) {
    return Vector2.distanceTo(this, v)
  }

  /**
   * Returns the squared distance between this vector and another vector.
   *
   * @param {Vector2} v - The other vector.
   * @returns {number}
   */
  distanceToSquared(v) {
    return Vector2.distanceToSquared(this, v)
  }

  /**
   * Makes this a unit vector.
   * @returns {this}
   */
  normalize() {
    Vector2.normalize(this, this)

    return this
  }

  /**
   * Sets this vector to have the given length.
   *
   * @param {number} length
   */
  setMagnitude(length) {
    Vector2.setMagnitude(this, length, this)

    return this
  }

  /**
   * Adds a given vector into this.
   *
   * @param {Vector2} v
   * @returns {this}
   */
  add(v) {
    Vector2.add(this, v, this)

    return this
  }

  /**
   * Adds a scalar value into this vector's component values.
   *
   * @param {number} n
   */
  addScalar(n) {
    Vector2.addScalar(this, n, this)

    return this
  }

  /**
   * Subtracts a given vector from this vector.
   *
   * @param { Vector2} v
   * @returns {this}
   */
  subtract(v) {
    Vector2.subtract(this, v, this)

    return this
  }

  /**
   * Subtracts a scalar value from this vector's component values.
   *
   * @param {number} n
   * @returns {this}
   */
  subtractScalar(n) {
    Vector2.subtractScalar(this, n, this)

    return this
  }

  /**
   * Multiplies this vector with a given vector.
   * @param {Vector2} v
   * @returns {this}
   */
  multiply(v) {
    Vector2.multiply(this, v, this)

    return this
  }

  /**
   * Multiplies a scalar value with this vector's component values.
   * @param {number} s
   * @returns {this}
   */
  multiplyScalar(s) {
    Vector2.multiplyScalar(this, s, this)

    return this
  }

  /**
   * Divides this vector with a scalar.
   *
   * @param {Vector2} v
   * @returns {this}
   */
  divide(v) {
    Vector2.divide(this, v, this)

    return this
  }

  /**
   * @param {number} s
   * @returns {this}
   */
  divideScalar(s) {
    Vector2.divideScalar(this, s, this)

    return this
  }

  /**
   * Calculates the dot product of this with another vector.
   *
   * @param {Vector2} v
   * @returns {number}
   */
  dot(v) {
    return Vector2.dot(this, v)
  }

  /**
   * Calculates the cross product of this with another vector.
   *
   * @param {Vector2} v
   * @returns {number}
   */
  cross(v) {
    return Vector2.cross(this, v)
  }

  /**
   * Negates the values of this vector.
   *
   * @returns {this}
   */
  reverse() {
    Vector2.reverse(this, this)

    return this
  }

  /**
   * @returns {this}
   */
  invert() {
    Vector2.invert(this, this)

    return this
  }

  /**
   * Checks to see if this vector is equal to another vector.
   *
   * @param { Vector2} v
   * @returns {boolean}
   */
  equals(v) {
    return Vector2.equal(this, v)
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {Vector2} out
   */
  static set(x, y, out = new Vector2()) {
    out.x = x
    out.y = y

    return out
  }

  /**
   * @param {Vector2} v
   * @param {Vector2} [out=new Vector2()]
   */
  static copy(v, out = new Vector2()) {
    out.x = v.x
    out.y = v.y

    return out
  }

  /**
   * @param {number} scalar
   * @param {Vector2} out
   * @returns {Vector2}
   */
  static splat(scalar, out = new Vector2()) {
    return Vector2.set(scalar, scalar, out)
  }

  /**
   * @param {Vector2} v
   */
  static magnitudeSquared(v) {
    return v.y ** 2 + v.x ** 2
  }

  /**
   * @param {Vector2} v
   */
  static magnitude(v) {
    return Math.sqrt(Vector2.magnitudeSquared(v))
  }

  /**
   * Calculates length squared of this vector to another vector.
   *
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static distanceToSquared(v1, v2) {
    const temp = new this(v1.x - v2.x, v1.y - v2.y)

    return this.magnitudeSquared(temp)
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static distanceTo(v1, v2) {
    const temp = new this(v1.x - v2.x, v1.y - v2.y)

    return this.magnitude(temp)
  }

  /**
   * @param {Vector2} v
   * @param {Vector2} [out=new Vector2()]
   */
  static normalize(v, out = new Vector2()) {
    const length = Vector2.magnitude(v)

    if (length === 0) return out

    out.x = v.x / length
    out.y = v.y / length

    return out
  }

  /**
   * @param {Vector2} v
   * @param {number} length
   * @param {Vector2} [out]
   */
  static setMagnitude(v, length, out = new Vector2()) {
    this.normalize(v, out)
    this.multiplyScalar(out, length, out)

    return out
  }

  /**
   * @param {Vector2} v
   * @param {number} min
   * @param {number} max
   * @param {Vector2} out
   */
  static clampMagnitude(v, min, max, out) {
    if (this.equal(v, this.Zero)) return this.copy(v, out)

    const length = this.magnitude(v)

    if (length > max) return this.multiplyScalar(v, max / length, out)
    if (length < min) return this.multiplyScalar(v, min / length, out)

    return this.copy(v, out)
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   * @param {Vector2} [out]
   */
  static add(v1, v2, out = new Vector2()) {
    out.x = v1.x + v2.x
    out.y = v1.y + v2.y

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {number} n
   * @param {Vector2} [out]
   */
  static addScalar(v1, n, out = new Vector2()) {
    out.x = v1.x + n
    out.y = v1.y + n

    return out
  }

  /**
   * @param {Vector2} from
   * @param {Vector2} to
   * @param {Vector2} [out]
   */
  static subtract(from, to, out = new Vector2()) {
    out.x = from.x - to.x
    out.y = from.y - to.y

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {number} n
   * @param {Vector2} [out]
   */
  static subtractScalar(v1, n, out = new Vector2()) {
    out.x = v1.x - n
    out.y = v1.y - n

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   * @param {Vector2} [out]
   */
  static multiply(v1, v2, out = new Vector2()) {
    out.x = v1.x * v2.x
    out.y = v1.y * v2.y

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {number} n
   * @param {Vector2} [out]
   */
  static multiplyScalar(v1, n, out = new Vector2()) {
    out.x = v1.x * n
    out.y = v1.y * n

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   * @param {Vector2} [out]
   */
  static divide(v1, v2, out = new Vector2()) {
    out.x = v1.x / v2.x
    out.y = v1.y / v2.y

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {number} n
   * @param {Vector2} [out]
   */
  static divideScalar(v1, n, out = new Vector2()) {
    return Vector2.multiplyScalar(v1, 1 / n, out)
  }

  /**
   * @param {Vector2} v
   * @param {Vector2} [out=new Vector2()]
   */
  static reverse(v, out = new Vector2()) {
    return Vector2.multiplyScalar(v, -1, out)
  }

  /**
   * @param {Vector2} v
   * @param {Vector2} out
   */
  static invert(v, out = new Vector2()) {
    out.x = invert(v.x)
    out.y = invert(v.y)

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static cross(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x
  }

  /**
   * @param {Vector2} v1
   * @param {number} n
   * @param {Vector2} out
   */
  static crossScalar(v1, n, out = new Vector2()) {
    out.x = v1.y * -n
    out.y = v1.x * n

    return out
  }

  /**
   * Returns a Vector2 that has been lerped between v1 and v2.
   * @param { Vector2} from - The vector to lerp from.
   * @param { Vector2} to - The vector to lerp from.
   * @param {number} t - A value from 0 to 1 to scale the new Vector2 between v1 and v2.
   * @param { Vector2} [out] - The vector to store results into.
   *
   * @returns { Vector2}
   */
  static lerp(from, to, t, out = new Vector2()) {
    out.x = lerp(from.x, to.x, t)
    out.y = lerp(from.y, to.y, t)

    return out
  }

  /**
   * @param {Vector2} v
   * @param {Vector2} normal
   * @param {Vector2} [out]
   */
  static reflect(v, normal, out = new Vector2()) {
    const multiplier = this.dot(v, normal) * 2

    out.x = v.x - normal.x * multiplier
    out.y = v.y - normal.y * multiplier

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static equal(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y
  }

  /**
   * @param {Vector2} v
   * @param {Vector2} out
   */
  static normal(v, out = new Vector2()) {
    return Vector2.set(-v.y, v.x, out)
  }

  /**
   * @param {Vector2} v
   * @param {number} angle
   * @param {Vector2} out
   */
  static rotate(v, angle, out = new Vector2()) {
    return Vector2.rotateFast(v, Math.cos(angle), Math.sin(angle), out)
  }

  /**
   * @param {Vector2} v
   * @param {number} cos
   * @param {number} sin
   * @param {Vector2} out
   */
  static rotateFast(v, cos, sin, out = new Vector2()) {
    const { x } = v

    out.x = x * cos - v.y * sin
    out.y = x * sin + v.y * cos

    return out
  }

  /**
   * Gets the angle (in radians) between two
   * vectors in the shortest direction from v1 to v2 in the range of `0` to `Math.PI`.
   *
   * @param { Vector2} v1 - Start of the angle.
   * @param { Vector2} v2 - End of the angle.
   * @returns {number}
   */
  static angleBetween(v1, v2) {
    return Math.acos(this.dot(v1, v2) / (this.magnitude(v1) * this.magnitude(v2)))
  }

  /**
   * Returns a unit vector pointing in the
   * given angle starting from the positive x axis.
   *
   * @param {number} angle - Angle in radians from 0 to `Math.PI * 2`.
   * @param { Vector2} [out] - Vector2 to store results in.
   * @returns { Vector2}
   */
  static fromAngle(angle, out = new Vector2()) {
    Vector2.set(Math.cos(angle), Math.sin(angle), out)

    return out
  }

  /**
   * Returns the angle in radians between the positive x-axis and the vector.
   *
   * @param { Vector2} v
   * @returns {number}
   */
  static toAngle(v) {
    const a = Math.atan2(v.y, v.x)

    return a < 0 ? TAU + a : a
  }

  /**
   * Generates a new unit Vector2 in a random direction.
   *
   * @param { Vector2} [out]
   * @returns {Vector2}
   */
  static random(out) {
    return Vector2.fromAngle(Math.random() * TAU, out)
  }

  /**
   * Allows for iteration of components.
   *
   * @yields {number}
   */
  * [Symbol.iterator]() {
    yield this.x
    yield this.y
  }

  /**
   * A vector whose x and y values will remain 0.
   *
   * @readonly
   * @type { Vector2 }
   */
  static Zero = new Vector2()

  /**
   * A unit vector pointing in the x-axis.
   *
   * @readonly
   * @type { Vector2 }
   */
  static X = new Vector2(1, 0)

  /**
   * A unit vector pointing in the y-axis.
   *
   * @readonly
   * @type { Vector2 }
   */
  static Y = new Vector2(0, 1)

  /**
   * A unit vector pointing in the negative x-axis.
   *
   * @readonly
   * @type { Vector2 }
   */
  static NegX = new Vector2(-1, 0)

  /**
   * A unit vector pointing in the nega y-axis.
   *
   * @readonly
   * @type { Vector2 }
   */
  static NegY = new Vector2(0, -1)
}