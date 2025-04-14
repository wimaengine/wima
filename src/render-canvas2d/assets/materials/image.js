import { Handle } from '../../../asset/index.js'
import { Material,Image } from '../../../render-core/index.js'
import { MaterialType } from '../../core/materialtype.js'

export class CanvasImageMaterial extends Material {

  /**
   * @type {MaterialType}
   */
  type = MaterialType.Image

  /**
   * @type {Handle<Image>}
   */
  image

  /**
   * @type {number}
   */
  divisionX

  /**
   * @type {number}
   */
  divisionY

  /**
   * @type {number}
   */
  frameX

  /**
   * @type {number}
   */
  frameY

  /**
   * @type {number}
   */
  width

  /**
   * @type {number}
   */
  height

  /**
   * @param {ImageMaterialOptions} options
   */
  constructor({
    image,
    divisionX = 1,
    divisionY = 1,
    frameX = 0,
    frameY = 0,
    width = 250,
    height = 250
  }) {
    super()
    this.image = image
    this.divisionX = divisionX
    this.divisionY = divisionY
    this.frameX = frameX
    this.frameY = frameY
    this.width = width
    this.height = height
  }
}

/**
 * @typedef ImageMaterialOptions
 * @property {Handle<Image>} image
 * @property {number} [divisionX] Never be zero.
 * @property {number} [divisionY] Must not br zero.
 * @property {number} [frameX]
 * @property {number} [frameY]
 * @property {number} [width]
 * @property {number} [height]
 */