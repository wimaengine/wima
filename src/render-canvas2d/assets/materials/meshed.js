import { Color } from '../../../math/index.js'
import { Material } from '../../../render-core/index.js'
import { MaterialType } from '../../core/materialtype.js'

export class CanvasMeshedMaterial extends Material {

  /**
   * @type {MaterialType}
   */
  type = MaterialType.Basic

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
   * @param {CanvasMeshedMaterialOptions} options 
   */
  constructor({
    fill = new Color(),
    stroke = new Color(255, 255, 255),
    strokeWidth = 1
  }){
    super()
    this.fill = fill
    this.stroke = stroke
    this.strokeWidth = strokeWidth
  }
}

/**
 * @typedef CanvasMeshedMaterialOptions
 * @property {Color} [fill]
 * @property {Color} [stroke]
 * @property {number} [strokeWidth]
 */