/** @import { ComponentId } from './typedef/index.js'*/
/** @import { Constructor,TypeId } from '../reflect/index.js'*/

import { ComponentInfo } from './component/index.js'
import { typeid } from '../reflect/index.js'

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
   * @template T
   * @param {Constructor<T>} type
   * @returns {ComponentId}
   */
  set(type) {
    const id = this.list.length
    const typeId = typeid(type)

    this.map.set(typeId, id)
    this.list.push(new ComponentInfo(id, typeId))

    return id
  }

  /**
   * @template T
   * @param {Constructor<T>} type
   * @returns {boolean}
   */
  has(type) {
    return this.map.has(typeid(type))
  }

  /**
   * @template T
   * @param {Constructor<T>} type
   * @returns {ComponentInfo | undefined}
   */
  get(type) {
    const id = this.getId(type)

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
   * @template T
   * @param {Constructor<T>} type
   * @returns {ComponentId | undefined}
   */
  getId(type) {
    return this.map.get(typeid(type))
  }
}