import { Rotary } from './rotary.js'
import { Vector2 } from './vector2.js'


/**
 * A class that is used to transform positions through rotation, scaling and translation.
 *
 *  | a | c | e |
 *  |---|---|---|
 *  | b | d | f |
 */
export class Affine2 {

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
  x

  /**
   * @type {number}
   */
  y

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e13
   * @param {number} e21
   * @param {number} e22
   * @param {number} e23
   */
  constructor(e11 = 1, e12 = 0, e13 = 0, e21 = 0, e22 = 1, e23 = 0) {
    Affine2.set(e11, e12, e13, e21, e22, e23, this)
  }

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e13
   * @param {number} e21
   * @param {number} e22
   * @param {number} e23
   */
  set(e11, e12, e13, e21, e22, e23) {
    Affine2.set(e11, e12, e13, e21, e22, e23, this)

    return this
  }

  /**
   * Copies a affine into this affine.
   *
   * @param {Affine2} affine
   * @returns {this}
   */
  copy(affine) {
    Affine2.copy(affine, this)

    return this
  }

  /**
   * Creates a new affine,fills its values with this ones and returns the former.
   *
   * @returns {Affine2}
   */
  clone() {
    return new Affine2().copy(this)
  }

  /**
   * @param {Vector2} translation
   * @param {Rotary} orientation
   * @param {Vector2} scale
   *
   * @returns {this}
   */
  compose(translation, orientation, scale) {
    Affine2.compose(translation, orientation, scale, this)

    return this
  }

  /**
   * @returns {[Vector2,Rotary,Vector2]}
   */
  decompose() {
    return Affine2.decompose(this)
  }

  /**
   * Translates a affine by a given amount.
   *
   * @param {Vector2} translation
   * @returns {this}
   */
  translate(translation) {
    Affine2.translate(this, translation, this)

    return this
  }

  /**
   * Rotates the affine by the given angle.
   *
   * @param {Rotary} angle
   * @returns {this}
   */
  rotate(angle) {
    Affine2.rotate(this, angle, this)

    return this
  }

  /**
   * Scales a affine by a given amount.
   *
   * @param {Vector2} scale
   * @returns {this}
   */
  scale(scale) {
    Affine2.scale(this, scale, this)

    return this
  }

  /**
   * @param {Vector2} target
   * @returns {this}
   */
  lookAt(target) {
    const eye = new Vector2(this.x, this.y)

    Affine2.lookAt(eye, target, this)

    return this
  }

  /**
   * Transforms the given vector.
   *
   * @param { Vector2} vector
   */
  transform(vector) {
    return Affine2.transform(this, vector, vector)
  }

  /**
   * Inverts the affine.
   *
   * @returns {this}
   */
  invert() {
    Affine2.invert(this, this)

    return this
  }

  /**
   * Multiplies with another affine,
   *  A * B = C, where A is this affine.
   *
   * @param {Affine2} affine
   * @returns {this}
   */
  multiply(affine) {
    Affine2.multiply(this, affine, this)

    return this
  }

  /**
   * Multiplies with another affine,
   *  A * B = C, where A is this affine.
   *
   * @param {Affine2} affine
   * @returns {this}
   */
  divide(affine) {
    Affine2.divide(this, affine, this)

    return this
  }

  /**
   * Deeply checks if a affine is equal to another.
   *
   * @param {Affine2} affine
   * @returns {boolean}
   */
  equals(affine) {
    return Affine2.equal(this, affine)
  }

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e13
   * @param {number} e21
   * @param {number} e22
   * @param {number} e23
   * @param {Affine2} out
   */
  static set(e11, e12, e13, e21, e22, e23, out = new Affine2()) {
    out.a = e11
    out.b = e21
    out.c = e12
    out.d = e22
    out.x = e13
    out.y = e23

    return out
  }

  /**
   * @param {Affine2} affine
   * @param {Affine2} [out]
   */
  static copy(affine, out = new Affine2()) {
    out.a = affine.a
    out.b = affine.b
    out.c = affine.c
    out.d = affine.d
    out.x = affine.x
    out.y = affine.y

    return out
  }

  /**
   * @param {Affine2} out
   * @returns {Affine2}
   */
  static identity(out = new Affine2()) {
    this.set(1, 0, 0, 0, 1, 0, out)

    return out
  }

  /**
   * @param {Affine2} out
   * @returns {Affine2}
   */
  static zero(out = new Affine2()) {
    this.set(0, 0, 0, 0, 0, 0, out)


    return out
  }

  /**
   * @param {Vector2} translation
   * @param {Rotary} orientation
   * @param {Vector2} scale
   * @param {Affine2} affine
   * @returns {Affine2}
   */
  static compose(translation, orientation, scale, affine = new Affine2()) {
    const { cos, sin } = orientation

    affine.a = cos * scale.x
    affine.b = sin * scale.x
    affine.c = -sin * scale.y
    affine.d = cos * scale.y
    affine.x = translation.x
    affine.y = translation.y

    return affine
  }

  /**
   * @param {Affine2} affine
   * @param {Vector2} position 
   * @param {Rotary} orientation 
   * @param {Vector2} scale 
   * @returns {[Vector2,Rotary,Vector2]}
   */
  static decompose(
    affine,
    position = new Vector2(),
    orientation = new Rotary(),
    scale = new Vector2()
  ) {
    const scaleX = new Vector2(affine.a, affine.b).magnitude()
    const scaleY = new Vector2(affine.c, affine.d).magnitude()

    position.x = affine.x
    position.y = affine.y

    orientation.cos = affine.a / scaleX
    orientation.sin = affine.b / scaleX

    scale.x = scaleX
    scale.y = scaleY

    return [position, orientation, scale]
  }

  /**
   * @param {Affine2} affine1
   * @param {Affine2} affine2
   * @param {Affine2} [out]
   */
  static multiply(affine1, affine2, out = new Affine2()) {
    const { a: a1, b: b1, c: c1, d: d1, x: x1, y: y1 } = affine1
    const { a: a2, b: b2, c: c2, d: d2, x: x2, y: y2 } = affine2

    out.a = a2 * a1 + b2 * c1
    out.b = a2 * b1 + b2 * d1
    out.c = c2 * a1 + d2 * c1
    out.d = c2 * b1 + d2 * d1
    out.x = x2 * a1 + y2 * c1 + x1
    out.y = x2 * b1 + y2 * d1 + y1

    return out
  }

  /**
   * @param {Affine2} affine1
   * @param {Affine2} affine2
   * @param {Affine2} [out]
   */
  static divide(affine1, affine2, out = new Affine2()) {
    const multiplier = this.invert(affine2)

    this.multiply(affine1, multiplier, out)

    return out
  }

  /**
   * @param {Affine2} affine
   * @param {Affine2} [out]
   */
  static invert(affine, out = new Affine2()) {
    const { a, b, c, d, x, y } = affine
    const det = a * d - b * c
    const invDet = 1 / det

    if (det === 0) return this.zero(out)

    out.a = d * invDet
    out.b = -b * invDet
    out.c = -c * invDet
    out.d = a * invDet
    out.x = (c * y - d * x) * det
    out.y = -(a * y - b * x) * det

    return out
  }

  /**
   * @param {Affine2} affine
   * @param {Vector2} translation
   * @param {Affine2} [out]
   */
  static translate(affine, translation, out = new Affine2()) {
    out.a = affine.a
    out.b = affine.b
    out.c = affine.c
    out.d = affine.d
    out.x = affine.x + translation.x
    out.y = affine.y + translation.y

    return out
  }

  /**
   * @param {Affine2} affine
   * @param {Rotary} rotary
   * @param {Affine2} out
   */
  static rotate(affine, rotary, out = new Affine2()) {
    const { a, b, c, d, x, y } = affine
    const { cos, sin } = rotary

    out.a = a * cos - b * sin
    out.b = a * sin + b * cos
    out.c = c * cos - d * sin
    out.d = c * sin + d * cos
    out.x = x * cos - y * sin
    out.y = x * sin + y * cos

    return out
  }

  /**
   * @param {Affine2} affine
   * @param {Vector2} scale
   * @param {Affine2} [out]
   */
  static scale(affine, scale, out = new Affine2()) {
    out.a = affine.a * scale.x
    out.b = affine.b * scale.x
    out.c = affine.c * scale.y
    out.d = affine.d * scale.y
    out.x = affine.x
    out.y = affine.y

    return out
  }

  /**
   * @param {Vector2} eye
   * @param {Vector2} target
   * @param {Affine2} out
   */
  static lookAt(eye, target, out = new Affine2()) {
    const y = Vector2.subtract(target, eye)

    if (Vector2.magnitudeSquared(y) === 0) {
      y.x = 1
    }

    Vector2.normalize(y, y)

    out.a = y.x
    out.b = y.y
    out.c = -y.y
    out.d = y.x
    out.x = eye.y
    out.y = eye.y

    return out
  }

  /**
   * @param {Affine2} affine
   * @param {Vector2} v
   * @param {Vector2} [out]
   */
  static transform(affine, v, out = new Vector2()) {
    const { a, b, c, d, x, y } = affine
    const { x: vx, y: vy } = v

    out.x = a * vx + c * vy + x
    out.y = b * vx + d * vy + y

    return out
  }

  /**
   * @param {Affine2} affine1
   * @param {Affine2} affine2
   * @returns {boolean}
   */
  static equal(affine1, affine2) {
    return (
      (affine1.a === affine2.a) &&
      (affine1.b === affine2.b) &&
      (affine1.c === affine2.c) &&
      (affine1.d === affine2.d) &&
      (affine1.x === affine2.x) &&
      (affine1.y === affine2.y)
    )
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
    yield this.x
    yield this.y
  }

  /**
   * @readonly
   * @type {Affine2}
   */
  static Identity = Affine2.identity()

  /**
   * @readonly
   * @type {Affine2}
   */
  static Zero = Affine2.zero()
}