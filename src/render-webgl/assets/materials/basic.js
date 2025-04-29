
import { Color } from '../../../math/color.js'
import { Material } from '../../../render-core/index.js'
import {
  basicVertex as vertex,
  basicFragment as fragment
} from '../../shaders/index.js'

export class WebglBasicMaterial extends Material {

  /**
   * @type {BasicMaterialFlags}
   *
   * flags = BasicMaterialFlags.None
   */
  /**
   * @type {boolean}
   */
  enableVertexColors

  /**
   * @type {number}
   */
  opacity

  /**
   * @type {Color}
   */
  color
  constructor({
    enableVertexColors = false,
    enableTransparency = false,
    opacity = 1.0,
    color = new Color(1, 1, 1, 1)

    // flags = BasicMaterialFlags.None
  } = {}) {
    super()
    this.color = color
    this.enableVertexColors = enableVertexColors
    this.enableTransparency = enableTransparency
    this.opacity = opacity

    // this.flags = flags
  }

  /**
   * @returns {string}
   */
  vertex() {
    return vertex
  }

  /**
   * @returns {string}
   */
  fragment() {
    return fragment
  }
  asUniformBind() {
    return new Float32Array([
      Number(this.enableVertexColors),
      this.opacity,
      0,
      0,
      this.color.r,
      this.color.g,
      this.color.b,
      this.color.a
    ])
  }
}