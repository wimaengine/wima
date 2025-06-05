/** @import { ComponentId } from './typedef/index.js'*/
/** @import { TypeId } from '../reflect/index.js'*/

import { ComponentInfo } from './component/index.js'

export class TypeStore {

  /**
   * @private
   * @type {Map<TypeId,ComponentId>}
   */
  map = new Map()

  /**
   * @private
   * @type {Array<ComponentInfo>}
   */
  list = []

  /**
   * @param {Function} componentClass
   * @returns {ComponentId}
   */
  set(componentClass) {
    const id = this.list.length
    const name = componentClass.name.toLowerCase()

    this.map.set(name, id)
    this.list.push(new ComponentInfo(id, name))

    return id
  }

  /**
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    return this.map.has(name)
  }

  /**
   * @param {string} name
   * @returns {ComponentInfo | undefined}
   */
  get(name) {
    const id = this.getId(name)

    if (id === void 0) return undefined

    return this.getById(id)
  }

  /**
   * @param {ComponentId} id
   * @returns {ComponentInfo | undefined}
   */
  getById(id) {
    return this.list[id]
  }

  /**
   * @param {string} name
   * @returns {ComponentId | undefined}
   */
  getId(name) {
    return this.map.get(name)
  }
}