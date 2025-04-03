import { clamp, rand } from './math.js'

/**
 * A color manipulation class.
 */
export class Color {

  /**
   * @type {number}
   */
  r = 0

  /**
   * @type {number}
   */
  b = 0

  /**
   * @type {number}
   */
  g = 0

  /**
   * @type {number}
   */
  a = 1

  /**
   * @param {number} [r=0] - Red component [0 .. 255].
   * @param {number} [g=0] - Green component [0 .. 255].
   * @param {number} [b=0] - Blue component [0 .. 255].
   * @param {number} [alpha=1.0] - Alpha value [0.0 .. 1.0].
   */
  constructor(r = 0, g = 0, b = 0, alpha = 1.0) {
    this.set(r, g, b, alpha)
  }

  /**
   * Set this color to the specified value.
   * @param {number} r - Red component [0 .. 255].
   * @param {number} g - Green component [0 .. 255].
   * @param {number} b - Blue component [0 .. 255].
   * @param {number} [alpha=1.0] - Alpha value [0.0 .. 1.0].
   * @returns {this} Reference to this object for method chaining.
   */
  set(r, g, b, alpha = 1.0) {
    Color.set(this, r, g, b, alpha)

    return this
  }

  /**
   * Create a new copy of this color object.
   * @returns {Color} Reference to the newly cloned object.
   */
  clone() {
    return Color.copy(this)
  }

  /**
   * Copy a color object or CSS color into this one.
   * @param {Color} color
   * @returns {this} Reference to this object for method chaining.
   */
  copy(color) {
    Color.copy(color, this)

    return this
  }

  /**
   * Blend this color with the given one using addition.
   *
   * @param {Color} color
   * @returns {this} Reference to this object for method chaining.
   */
  add(color) {
    Color.add(this, color, this)

    return this
  }

  /**
   * Darken this color value by 0..1.
   *
   * @param {number} scale
   * @returns {this} Reference to this object for method chaining.
   */
  darken(scale) {
    Color.darken(this, scale, this)

    return this
  }

  /**
   * Lighten this color value by 0..1.
   *
   * @param {number} scale
   * @returns {this} Reference to this object for method chaining.
   */
  lighten(scale) {
    Color.lighten(this, scale, this)

    return this
  }

  /**
   * Linearly interpolate between this color and the given one.
   * @param {Color} color
   * @param {number} alpha - With alpha = 0 being this color, and alpha = 1 being the given one.
   * @returns {this} Reference to this object for method chaining.
   */
  lerp(color, alpha) {
    Color.lerp(this, color, alpha)

    return this
  }

  /**
   * Generate random r,g,b values for this color object.
   * @param {number} [min=0] - Minimum value for the random range.
   * @param {number} [max=255] - Maxmium value for the random range.
   * @returns {this} Reference to this object for method chaining.
   */
  random(min = 0, max = 255) {
    Color.random(min, max, this)

    return this
  }

  /**
   * @param {number} min
   * @param {number} max
   * @param {Color} [out]
   * @returns {Color}
   */
  static random(min = 0, max = 255, out = new Color()) {
    return Color.set(
      out,
      rand(min, max),
      rand(min, max),
      rand(min, max)
    )
  }

  /**
   * @param {Color} color
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} [a]
   */
  static set(color, r, g, b, a = 1.0) {
    color.r = r
    color.g = g
    color.b = b
    color.a = a

    return color
  }

  /**
   * @param {Color} color
   * @param {Color} [out]
   */
  static copy(color, out = new Color()) {
    return Color.set(out, color.r, color.g, color.b, color.a)
  }

  /**
   * @param {Color} color1
   * @param {Color} color2
   * @param {Color} [out]
   */
  static add(color1, color2, out = new Color()) {
    out.r = clamp(color1.r + color2.r, 0, 255)
    out.g = clamp(color1.g + color2.g, 0, 255)
    out.b = clamp(color1.b + color2.b, 0, 255)
    out.a = (color1.a + color2.a) / 2

    return out
  }

  /**
   * @param {Color} color1
   * @param {Color} color2
   * @param {Color} [out]
   */
  static sub(color1, color2, out = new Color()) {
    out.r = clamp(color1.r - color2.r, 0, 255)
    out.g = clamp(color1.g - color2.g, 0, 255)
    out.b = clamp(color1.b - color2.b, 0, 255)
    out.a = (color1.a + color2.a) / 2

    return out
  }

  /**
   * @param {Color} color
   * @param {number} scale
   * @param {Color} [out]
   */
  static darken(color, scale, out = new Color()) {
    const clampedScale = clamp(scale, 0, 1)

    out.r = color.r * clampedScale
    out.g = color.g * clampedScale
    out.b = color.b * clampedScale
    out.a = color.a

    return this
  }

  /**
   * @param {Color} color
   * @param {number} scale
   * @param {Color} [out]
   */
  static lighten(color, scale, out = new Color()) {
    const clampScale = clamp(scale, 0, 1)

    out.r = clamp(color.r + (1 - color.r) * clampScale, 0, 255)
    out.g = clamp(color.g + (1 - color.g) * clampScale, 0, 255)
    out.b = clamp(color.b + (1 - color.b) * clampScale, 0, 255)
    out.a = color.a

    return out
  }

  /**
   * @param {Color} color1
   * @param {Color} color2
   * @param {number} t
   * @param {Color} out
   */
  static lerp(color1, color2, t, out = new Color()) {
    out.r += color1.r + (color1.r - color2.r) * t
    out.g += color1.g + (color1.g - color2.g) * t
    out.b += color1.b + (color1.b - color2.b) * t
    out.a = color1.a + (color1.a - color2.a) * t

    return out
  }

  /**
   * Allows for iteration of components.
   *
   * @yields {number}
   */
  * [Symbol.iterator]() {
    yield this.r
    yield this.g
    yield this.b
    yield this.a
  }

  /**
   * @readonly
   * @type {Color}
   */
  static BLACK = new Color(0, 0, 0)

  /**
   * @readonly
   * @type {Color}
   */
  static WHITE = new Color(1, 1, 1)

  /**
   * @readonly
   * @type {Color}
   */
  static RED = new Color(1, 0, 0)

  /**
   * @readonly
   * @type {Color}
   */
  static GREEN = new Color(0, 1, 0)
  
  /**
   * @readonly
   * @type {Color}
   */
  static BLUE = new Color(0, 0, 1)
  
  /**
   * @readonly
   * @type {Color}
   */
  static YELLOW = new Color(1, 1, 0)

  /**
   * @readonly
   * @type {Color}
   */
  static PURPLE = new Color(1, 0, 1, 1)
  
  /**
   * @readonly
   * @type {Color}
   */
  static CYAN = new Color(0, 1, 1, 1)
}