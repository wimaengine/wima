export class Linear2DDamping {

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
   * @param {Linear2DDamping} value
   * @returns {Linear2DDampingSerial}
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * @param {Linear2DDampingSerial} value
   * @param {Linear2DDamping} [out]
   */
  static deserialize(value, out = new Linear2DDamping()) {
    out.value = value.value

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is Linear2DDampingSerial}
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
 * Serialized form of `Linear2DDamping`.
 *
 * @typedef Linear2DDampingSerial
 * @property {number} value
 */

export class Linear3DDamping {

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
   * @param {Linear3DDamping} value
   * @returns {Linear3DDampingSerial}
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * @param {Linear3DDampingSerial} value
   * @param {Linear3DDamping} [out]
   */
  static deserialize(value, out = new Linear3DDamping()) {
    out.value = value.value

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is Linear3DDampingSerial}
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
 * Serialized form of `Linear3DDamping`.
 *
 * @typedef Linear3DDampingSerial
 * @property {number} value
 */
