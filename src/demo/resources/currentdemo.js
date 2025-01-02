import { Demo } from '../core/index.js'

export class CurrentDemo {

  /**
   * @private
   * @type {Demo}
   */
  inner

  /**
   * @param {Demo} initial
   */
  constructor(initial) {
    this.inner = initial
  }

  /**
   * @returns {Demo}
   */
  get() {
    return this.inner
  }
  getName() {
    return this.inner.name
  }

  /**
   * @param {Demo} demo
   */
  set(demo) {
    this.inner = demo
  }
}