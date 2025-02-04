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
}
