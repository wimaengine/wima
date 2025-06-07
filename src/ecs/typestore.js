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
    const typeId = typeid(type)

    return this.setByTypeId(typeId)
  }

  /**
   * @param {TypeId} id 
   * @returns {ComponentId}
   */
  setByTypeId(id){
    const compId = this.list.length

    this.map.set(id, compId)
    this.list.push(new ComponentInfo(compId, id))

    return compId
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
   * @param {ComponentId} id
   * @returns {boolean}
   */
  hasId(id) {
    return id < this.list.length && id >= 0
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
   * @param {TypeId} typeId
   */
  getByTypeId(typeId){
    const id = this.getIdByTypeId(typeId)

    if (id === void 0) return undefined

    return this.getById(id)
  }

  /**
   * @template T
   * @param {Constructor<T>} type
   * @returns {ComponentId | undefined}
   */
  getId(type) {
    return this.map.get(typeid(type))
  }

  /**
   * @template T
   * @param {TypeId} id
   * @returns {ComponentId | undefined}
   */
  getIdByTypeId(id) {
    return this.map.get(id)
  }

  /**
   * @returns {Iterable<ComponentInfo>}
   */
  getInfos(){
    return this.list
  }
}