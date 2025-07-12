import { Color } from '../../../math/index.js'
import { Material } from '../material.js'

export class BasicMaterial extends Material {

  /**
   * @type {Color}
   */
  color = new Color()

  /**
   * @param {BasicMaterialOptions} options 
   */
  constructor({
    color = new Color()
  } = {}) {
    super()
    this.color = color
  }


  asUniformBind() {
    return new Float32Array([...this.color]).buffer
  }

  static default() {
    return new BasicMaterial()
  }
}

/**
 * @typedef BasicMaterialOptions
 * @property {Color} [color]
 */