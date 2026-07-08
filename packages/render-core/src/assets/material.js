
export class Material {

  /**
   * @returns {string}
   */
  vertex() {
    return ''
  }

  /**
   * @returns {string}
   */
  fragment() {
    return ''
  }
  static default() {
    return new Material()
  }

  /**
   * @param {Material} _value
   */
  static serialize(_value) {
    return {}
  }

  /**
   * @param {unknown} _value
   * @param {Material} [out]
   */
  static deserialize(_value, out = new Material()) {
    return out
  }
}

export default {}
