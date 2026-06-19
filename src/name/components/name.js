export class Name {

  /**
   * @type {string}
   */
  value

  /**
   * @param {string} name
   */
  constructor(name = '') {
    this.value = name
  }

  /**
   * @param {Name} source
   * @param {Name} target
   */
  static copy(source, target = new Name('')) {
    target.value = source.value

    return target
  }

  /**
   * @param {Name} target
   */
  static clone(target) {
    return Name.copy(target)
  }

  /**
   * @param {Name} value
   * @returns {string}
   */
  static serialize(value) {
    return value.value
  }

  /**
   * @param {string} value
   * @param {Name} [out]
   */
  static deserialize(value, out = new Name()) {
    out.value = value

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is string}
   */
  static validateSerial(value) {
    return typeof value === 'string'
  }
}

/**
 * @typedef NameSerial
 * @property {string} value
 */
