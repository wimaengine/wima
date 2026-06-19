import { Color } from '../../../color/index.js'
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

  /**
   * @param {BasicMaterial} value
   */
  static serialize(value) {
    return {
      color: Color.serialize(value.color)
    }
  }

  /**
   * @param {BasicMaterialSerial} value
   * @param {BasicMaterial} [out]
   */
  static deserialize(value, out = new BasicMaterial()) {
    out.color = Color.deserialize(value.color, out.color)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is BasicMaterialSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('color' in value)) {
      return false
    }

    return Color.validateSerial(value.color)
  }
}

/**
 * @typedef BasicMaterialOptions
 * @property {Color} [color]
 */

/**
 * @typedef BasicMaterialSerial
 * @property {import('../../../color/core/color.js').ColorSerial} color
 */
