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
    return this.copy(target)
  }
}
