import { lerp } from '../math/index.js'

export class Range {

  /**
   * @type {number}
   */
  start

  /**
   * @type {number}
   */
  end
  constructor(start = 0, end = 1) {
    this.start = start
    this.end = end
  }

  /**
   * @returns {boolean}
   */
  valid() {
    return this.start <= this.end
  }

  /**
   * @param {number} t
   */
  lerp(t) {
    return lerp(this.start, this.end, t)
  }
}
