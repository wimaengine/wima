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
  constructor(initial){
    this.inner = initial
  }

  /**
   * @returns {Demo}
   */
  get(){
    return this.inner
  }
  getName(){
    return this.inner.name
  }

  /**
   * @param {string} name
   * @param {Demo} demo
   */
  set(name, demo){
    this.name = name
    this.inner = demo
  }
}