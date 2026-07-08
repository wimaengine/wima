export class MeshAttributeData {

  /**
   * @type {Float32Array}
   */
  data

  /**
   * @param {Float32Array} data
   */
  constructor(data) {
    this.data = data
  }

  /**
   * @param {MeshAttributeData} value
   */
  static serialize(value) {
    return {
      data: Array.from(value.data)
    }
  }

  /**
   * @param {MeshAttributeDataSerial} value
   * @param {MeshAttributeData} [out]
   */
  static deserialize(value, out = new MeshAttributeData(new Float32Array())) {
    out.data = new Float32Array(value.data)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is MeshAttributeDataSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('data' in value)) {
      return false
    }

    return Array.isArray(value.data)
  }
}

/**
 * @typedef MeshAttributeDataSerial
 * @property {number[]} data
 */
