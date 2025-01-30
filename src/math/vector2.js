import { TWO_PI } from './constants.js'

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
   * Calculates length squared of vector and returns it.
   *
   * @returns {number}
   */
  magnitudeSquared() {
    return Vector2.magnitudeSquared(this)
  }

  /**
   *Calculates length of this vector and returns
   * it.
   *
   * @returns {number}
   */
  magnitude() {
    return Vector2.magnitude(this)
  }

  /**
   * Sets a vector to have the given length.
   *
   * @param {number} length
   */
  setMagnitude(length) {
    Vector2.setMagnitude(this, length, this)

    return this
  }

  /**
   *Calculates length of this vector to another vector.
   * @param {Vector2} v - The other vector.
   * @returns {number}
   */
  distanceTo(v) {
    return Vector2.distanceTo(this, v)
  }

  /**
   *Calculates length squared of this vector to another vector.
   *
   * @param {Vector2} v - The other vector.
   * @returns {number}
   */
  distanceToSquared(v) {
    return Vector2.distanceToSquared(this, v)
  }

  /**
   * Adds a given vector into this .
   *
   * @param {Vector2} v
   * @returns {this}
   */
  add(v) {
    Vector2.add(this, v, this)

    return this
  }

  /**
   * Adds a scalar value into this vector's
   * x and y values.
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
  sub(v) {
    Vector2.sub(this, v, this)

    return this
  }

  /**
   * Subtracts a scalar value from this vector's x and y values.
   *
   * @param {number} n
   * @returns {this}
   */
  subScalar(n) {
    Vector2.subScalar(this, n, this)

    return this
  }

  /**
   * Multiplies this vector with a scalar.
   *
   * @param {number} n
   * @returns {this}
   */
  
  /**
   * @param {Vector2} v
   * @returns {this}
   */
  multiply(v) {
    Vector2.multiply(this, v, this)

    return this
  }

  /**
   * Rotates this vector by a given angle in radians.
  *
  * @param {number} cos
   * @param {number} sin
   * @returns {this}
   */
  rotateFast(cos, sin) {
    Vector2.rotateFast(this, cos, sin, this)

    return this
  };

  /**
   *
   * Returns an array with x and y values of
   * this vector pushed into the array in
   * that order.
   *
   * @param {number[]} [target = []] - The array to
   * push values.Defaults to creating a new
   * array if not provided one.
   * @param {number} offset
   * @returns {number[]}
   */
  toArray(target = [], offset = 0) {
    target[offset] = this.x
    target[offset + 1] = this.y

    return target
  }

  /**
   * Copies x and y values of this vector to
   * a new vector and returns the new vector.
   * @returns {Vector2}
   */
  clone() {
    return Vector2.copy(this)
  }

  /**
   * Copies x and y values of another vector
   * to this vector.
   *
   * @param { Vector2} v
   * @returns {this}
   */
  copy(v) {
    Vector2.copy(v, this)

    return this
  }

  /**
   * Sets x and y values of this vector to the given parameter.
   *
   * @param {number} x
   * @param {number} y
   */
  set(x, y) {
    Vector2.set(this, x, y)

    return this
  }

  /**
   * Returns a vector of this reflected on a sirface perpendicular to the normal.
   *
   * @param {Vector2} normal - The unit vector perpendicular to reflection surface.
   * @param {Vector2} [target]
   * @returns {Vector2}
   */
  reflect(normal, target = new Vector2()) {
    Vector2.reflect(this, normal, target)

    return target
  }

  /**
   * Forces this vector to have a length
   * between the min and max.
   *
   * @param {number} [min = 0] - The smallest value
   * the length of this vector is allowed to have.
   * @param {number} [max = 1] - The biggest value the length of this vector is allowed to have.
   * @returns {this}
   */
  clamp(min = 0, max = 1) {
    Vector2.clampMagnitude(this, min, max, this)

    return this
  }

  /**
   * Calculates the dot product of two vectors.
   *
   * @param {Vector2} v
   * @returns {number}
   */
  dot(v) {
    return Vector2.dot(this, v)
  }

  /**
   * Calculates the cross product of two vectors.
   *
   * @param {Vector2} v
   * @returns {number}
   */
  cross(v) {
    return Vector2.cross(this, v)
  }

  /**
   * Makes this vector a unit vector by
   * dividing its components with its length.
   *
   * @returns {this}
   */
  normalize() {
    Vector2.normalize(this, this)

    return this
  }

  /**
   * Returns the normal to this vector.
   * @returns {Vector2}
   */
  normal() {
    const out = new Vector2()

    Vector2.normal(this, out)

    return out
  }

  /**
   * Returns the normal to a vector, the normal has the same length as the vector.
   *
   * @param { Vector2} [target = Vector2] - Vector2 in which results are stored.
   * @returns {Vector2}
   */
  normalFast(target = new Vector2()) {
    Vector2.set(target, -this.y, this.x)

    return this
  }

  /**
   * Rotates this vector by a given angle in radians.
   *
   * @param {number} rad - Angle in radians.
   * @returns {this}
   */
  rotate(rad) {
    Vector2.rotate(this, rad, this)

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
  divideScalar(s){
    Vector2.divideScalar(this,s,this)
    return this
  }

  /**
   * Checks to see if this vector is equal to
   * another vector.
   *
   * @param { Vector2} v
   * @returns {boolean}
   */
  equals(v) {
    return Vector2.equal(this, v)
  }

  /**
   * Checks if the vector length is zero.
   *
   * @returns {boolean}
   */
  equalsZero() {
    return Vector2.equalsZero(this)
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
   * @param {Vector2} v
   * @param {number} length
   * @param {Vector2} [out]
   */
  static setMagnitude(v, length, out = new Vector2()) {
    Vector2.normalize(v, out)
    Vector2.multiplyScalar(v, length, out)

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static distanceTo(v1, v2) {
    const temp = new Vector2(v1.x - v2.x, v1.y - v2.y)

    return Vector2.magnitude(temp)
  }

  /**
   * Calculates length squared of this vector to another vector.
   *
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static distanceToSquared(v1, v2) {
    const temp = new Vector2(v1.x - v2.x, v1.y - v2.y)

    return Vector2.magnitudeSquared(temp)
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
   * @param {Vector2} v1
   * @param {Vector2} v2
   * @param {Vector2} [out]
   */
  static sub(v1, v2, out = new Vector2()) {
    out.x = v1.x - v2.x
    out.y = v1.y - v2.y

    return out
  }

  /**
   * @param {Vector2} v1
   * @param {number} n
   * @param {Vector2} [out]
   */
  static subScalar(v1, n, out = new Vector2()) {
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
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static equal(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y
  }

  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static absEqual(v1, v2) {
    return (
      Math.abs(v1.x) === Math.abs(v2.x) ||
      Math.abs(v1.y) === Math.abs(v2.y)
    )
  }

  /**
   * @param {Vector2} v
   */
  static equalsZero(v) {
    return v.x === 0 && v.y === 0
  }

  /**
   * @param {Vector2} v
   * @param {Vector2} out
   */
  static normal(v, out = new Vector2()) {
    return Vector2.set(out, -v.y, v.x)
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
   * @param {Vector2} v
   * @param {Vector2} [out=new Vector2()]
   */
  static copy(v, out = new Vector2()) {
    out.x = v.x
    out.y = v.y

    return out
  }

  /**
   * @param {Vector2} v
   * @param {number} x
   * @param {number} y
   */
  static set(v, x, y) {
    v.x = x
    v.y = y

    return v
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
   * @param {Vector2} normal
   * @param {Vector2} [out]
   */
  static reflect(v, normal, out = new Vector2()) {
    const multiplier = Vector2.dot(v, normal) * 2

    out.x = normal.x * multiplier - v.x
    out.y = normal.y * multiplier - v.y

    return out
  }

  /**
   * @param {Vector2} v
   * @param {number} min
   * @param {number} max
   * @param {Vector2} out
   */
  static clampMagnitude(v, min, max, out) {
    if (Vector2.equalsZero(v)) return Vector2.copy(v, out)

    const length = Vector2.magnitude(v)

    if (length > max) return Vector2.multiplyScalar(v, max / length, out)
    if (length < min) return Vector2.multiplyScalar(v, min / length, out)

    return Vector2.copy(v, out)
  }

  /**
   * Gets the angle (in degrees) between two
   * vectors in the range 0° to 360° in the anticlockwise direction from v1 to v2.
   *
   * @param { Vector2} v1 - Start of the angle.
   * @param { Vector2} v2 - End of the angle.
   * @returns {number}
   */
  static getAbsDegBtwn(v1, v2) {
    const a = Vector2.cross(v1, v2)
    const deg = Vector2.getDegBtwn(v1, v2)

    return a < 0 ? deg : 360 - deg
  }

  /**
   * Same as ` Vector2.getAbsDegBtwn` but returns in radians.
   *
   * @param { Vector2 } v1 - Start of the angle.
   * @param { Vector2 } v2 - End of the angle.
   * @returns {number}
   */
  static getAbsAngleBetween(v1, v2) {
    const a = Vector2.cross(v1, v2)
    const deg = Vector2.getAngleBetween(v1, v2)

    return a < 0 ? deg : Math.PI * 2 - deg
  }

  /**
   * Gets the angle (in radians) between two
   * vectors in the shortest direction from v1 to v2 in the range of `0` to `Math.PI`.
   *
   * @param { Vector2} v1 - Start of the angle.
   * @param { Vector2} v2 - End of the angle.
   * @returns {number}
   */
  static getAngleBetween(v1, v2) {
    return Math.acos(Vector2.dot(v1, v2) / (Vector2.magnitude(v1) * Vector2.magnitude(v2)))
  }

  /**
   * Gets the angle (in degrees) between two
   * vectors in shortest direction from v1 to v2 in the range `0°` to `180°`.
   *
   * @param { Vector2} v1 - Start of the angle.
   * @param { Vector2} v2 - End of the angle.
   * @returns {number}
   */
  static getDegBtwn(v1, v2) {
    return Vector2.getAngleBetween(v1, v2) * 180 / Math.PI
  }

  /**
   * Returns a unit vector pointing in the
   * given angle starting from the positive x axis.
   *
   * @param {number} radian - Angle in radians from 0 to `Math.PI * 2`.
   * @param { Vector2} [out] - Vector2 to store results in.
   * @returns { Vector2}
   */
  static fromAngle(radian, out = new Vector2()) {
    Vector2.set(out, Math.cos(radian), Math.sin(radian))

    return out
  }

  /**
   * Generates a new unit Vector2 in a random direction.
   *
   * @param { Vector2} [out]
   * @returns {Vector2}
   */
  static random(out) {
    return Vector2.fromAngle(Math.random() * TWO_PI, out)
  }

  /**
   * Returns a Vector2 that has been lerped between v1 and v2.
   * @param { Vector2} v1 - The vector to lerp from.
   * @param { Vector2} v2 - The vector to lerp from.
   * @param {number} t - A value from 0 to 1 to scale the new Vector2 between v1 and v2.
   * @param { Vector2} [out] - The vector to store results into.
   *
   * @returns { Vector2}
   */
  static lerp(v1, v2, t, out = new Vector2()) {
    Vector2.set(
      out,
      (v2.x - v1.x) * t + v1.x,
      (v2.y - v1.y) * t + v1.y
    )

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

    return a < 0 ? TWO_PI + a : a
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
  static ZERO = new Vector2()

  /**
   * Default up direction.
   *
   * @readonly
   * @type { Vector2 }
   */
  static UP = new Vector2(0, 1)
}