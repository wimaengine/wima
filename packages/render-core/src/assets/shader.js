import { ShaderStage } from '../core'

export class Shader {

  /**
   * @readonly
   * @type {ShaderStage}
   */
  stage

  /**
   * @type {string}
   */
  source

  /**
   * @param {ShaderStage} stage
   * @param {string} source
   */
  constructor(stage, source) {
    this.stage = stage
    this.source = source
  }
  static default() {
    return new Shader(ShaderStage.Fragment, '')
  }

  /**
   * @param {Shader} value
   */
  static serialize(value) {
    return {
      stage: value.stage,
      source: value.source
    }
  }

  /**
   * @param {ShaderSerial} value
   * @param {Shader} [out]
   */
  static deserialize(value, out = Shader.default()) {
    const target = /** @type {any} */ (out)

    target.stage = value.stage
    target.source = value.source

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is ShaderSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('stage' in value) || !('source' in value)) {
      return false
    }

    return typeof value.stage === 'number' &&
      typeof value.source === 'string'
  }
}

/**
 * @typedef ShaderSerial
 * @property {number} stage
 * @property {string} source
 */
