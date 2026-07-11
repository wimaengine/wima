export class Angular2DDamping {

  /**
   * @type {number}
   */
  value

  /**
   * @param {number} value
   */
  constructor(value = 0) {
    this.value = value
  }

  /**
   * @param {Angular2DDamping} value
   * @returns {Angular2DDampingSerial}
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * @param {Angular2DDampingSerial} value
   * @param {Angular2DDamping} [out]
   */
  static deserialize(value, out = new Angular2DDamping()) {
    out.value = value.value

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is Angular2DDampingSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('value' in value)) {
      return false
    }

    return typeof value.value === 'number'
  }
}

/**
 * Serialized form of `Angular2DDamping`.
 *
 * @typedef Angular2DDampingSerial
 * @property {number} value
 */
export class Angular3DDamping {

  /**
   * @type {number}
   */
  value

  /**
   * @param {number} value
   */
  constructor(value = 0) {
    this.value = value
  }

  /**
   * @param {Angular3DDamping} value
   * @returns {Angular3DDampingSerial}
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * @param {Angular3DDampingSerial} value
   * @param {Angular3DDamping} [out]
   */
  static deserialize(value, out = new Angular3DDamping()) {
    out.value = value.value

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is Angular3DDampingSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('value' in value)) {
      return false
    }

    return typeof value.value === 'number'
  }
}

/**
 * Serialized form of `Angular3DDamping`.
 *
 * @typedef Angular3DDampingSerial
 * @property {number} value
 */
