import { Matrix2x3, Vector2, Color } from '../../math/index.js'
import { GizmoSettings } from './settings.js'

/**
 * @abstract
 * @template T
 */
export class GizmoBuffer {

  /**
   * @type {T[]}
   */
  positions = []

  /**
   * @type {Color[]}
   */
  colors = []

  /**
   * @type {T[]}
   */
  stripPositions = []

  /**
   * @type {Color[]}
   */
  stripColors = []
  clear() {
    this.positions.length = 0
    this.colors.length = 0
    this.stripPositions.length = 0
    this.stripColors.length = 0
  }
}

/**
 * Immediate mode drawing of defined 2d shapes.
 * Should be used for visual debugging.
 */
export class Gizmo2D {

  /**
   * @private
   * @type {Matrix2x3}
   */
  transformation = new Matrix2x3()

  /**
   * @type {GizmoBuffer<Vector2>}
   */
  buffer = new GizmoBuffer()

  /**
   * @type {GizmoSettings}
   */
  settings

  /**
   * @param {GizmoSettings} settings
   */
  constructor(settings) {
    this.settings = settings
  }

  /**
   * @returns {this}
   */
  reset() {
    this.transformation.identity()

    return this
  }

  /**
   * @param {Matrix2x3} matrix 
   */
  setTransform(matrix) {
    this.transformation.copy(matrix)
  }

  /**
   * @param {Matrix2x3} matrix 
   * @returns {this}
   */
  transform(matrix) {
    this.transformation.multiply(matrix)

    return this
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @returns {this}
   */
  translate(x, y) {
    this.transformation.translate(x, y)

    return this
  }

  /**
   * @param {number} angle 
   * @returns {this}
   */
  rotate(angle) {
    this.transformation.rotate(angle)

    return this
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @returns {this}
   */
  scale(x, y) {
    this.transformation.scale(x, y)

    return this
  }

  /**
   * @param {Vector2} start 
   * @param {Vector2} end 
   * @param {Color} color 
   * @returns 
   */
  line(
    start = Vector2.ZERO.clone(),
    end = Vector2.X.clone(),
    color = Color.WHITE
  ) {
    this.lineGradient(start, end, color, color)

    return this
  }

  /**
   * @param {Vector2} start 
   * @param {Vector2} end 
   * @param {Color} colorStart 
   * @param {Color} colorEnd 
   * @returns {this}
   */
  lineGradient(start, end, colorStart, colorEnd) {
    this.buffer.positions.push(
      this.transformation.transform(start),
      this.transformation.transform(end)
    )
    this.buffer.colors.push(colorStart, colorEnd)

    return this
  }

  /**
   * @param {Vector2[]} strips
   * @param {Color} color
   * @returns {this}
   */
  lineStrip(strips, color) {
    for (let i = 0; i < strips.length; i++) {
      this.buffer.stripPositions.push(this.transformation.transform(strips[i]))
      this.buffer.stripColors.push(color)
    }

    this.buffer.stripPositions.push(new Vector2(NaN, NaN))
    this.buffer.stripColors.push(new Color(NaN, NaN, NaN, NaN))

    return this
  }

  /**
   * @param {[Vector2,Color][]} strips
   * @returns {this}
   */
  lineStripGradient(strips) {
    for (let i = 0; i < strips.length; i++) {
      this.buffer.stripPositions.push(this.transformation.transform(strips[i][0]))
      this.buffer.stripColors.push(strips[i][1])
    }

    this.buffer.stripPositions.push(new Vector2(NaN, NaN))
    this.buffer.stripColors.push(new Color(NaN, NaN, NaN, NaN))

    return this
  }
}
