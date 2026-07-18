export class WindowResize {

  /**
   * @readonly
   * @type {number}
   */
  width

  /**
   * @readonly
   * @type {number}
   */
  height

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width
    this.height = height
  }
}
