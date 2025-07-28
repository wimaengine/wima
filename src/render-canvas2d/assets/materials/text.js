import { Color } from '../../../color/index.js'
import { Material } from '../../../render-core/index.js'
import { MaterialType } from '../../core/materialtype.js'

export class CanvasTextMaterial extends Material {

  /**
   * @type {MaterialType}
   */
  type = MaterialType.Text

  /**
   * @type {Color}
   */
  fill

  /**
   * @type {Color}
   */
  stroke

  /**
   * @type {number}
   */
  strokeWidth

  /**
   * @type {number}
   */
  fontSize

  /**
   * @type {string}
   */
  text

  /**
   * @type {CanvasTextAlign}
   */
  align

  /**
   * @type {string}
   */
  font

  /**
   * @param {TextMaterialOptions} options
   */
  constructor({
    text,
    fill = new Color(255, 255, 255),
    stroke = new Color(255, 255, 255),
    strokeWidth = 1,
    fontSize = 16,
    font = 'sans serif',
    align = 'right'
  }) {
    super()
    this.text = text
    this.fill = fill
    this.stroke = stroke
    this.strokeWidth = strokeWidth
    this.font = font
    this.align = align
    this.fontSize = fontSize
  }
}

/**
 * @typedef TextMaterialOptions
 * @property {string} text
 * @property {string} [font]
 * @property {number} [fontSize]
 * @property {Color} [fill]
 * @property {Color} [stroke]
 * @property {number} [strokeWidth]
 * @property {CanvasTextAlign} [align]
 * 
 */