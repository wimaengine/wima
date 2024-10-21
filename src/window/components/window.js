export class Window {

  /**
   * @private
   * @type {number}
   */
  width = 0

  /**
   * @private
   * @type {number}
   */
  height = 0

  /**
   * @readonly
   * @type {string | undefined}
   */
  selector

  /**
   * @param {WindowOptions} options 
   */
  constructor({ selector, width = 720, height = 360 } = {}) {
    this.selector = selector
    this.width = width
    this.height = height
  }

  /**
   * Returns width of the window.
   * 
   * @returns {number}
   */
  getWidth() {
    return this.width
  }


  /**
   * Returns the height of the window.
   * 
   * @returns {number}
   */
  getHeight() {
    return this.height
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  set(width, height){
    this.width = width
    this.height = height
  }
}

/**
 * @typedef WindowOptions
 * @property {number} [width]
 * @property {number} [height]
 * @property {string} [selector]
 */