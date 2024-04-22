/** @import { ComponentId, ComponentName } from '../typedef/index.js'*/

import { ComponentHooks } from './hooks.js'


export class ComponentInfo {

  /**
   * @readonly
   * @type {ComponentId}
   */
  id = 0

  /**
   * @readonly
   * @type {ComponentName}
   */
  name

  /**
   * @private
   * @type {ComponentHooks}
   */
  hooks = new ComponentHooks()

  /**
   * @param {ComponentId} id
   * @param {string} name
   */
  constructor(id, name) {
    this.id = id
    this.name = name
  }

  /**
   * @template T
   * @returns {ComponentHooks}
   */
  getHooks() {
    return this.hooks
  }

  /**
   * @param {ComponentHooks} hooks
   */
  setHooks(hooks) {
    this.hooks = hooks
  }
}