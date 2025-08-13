/** @import { TypeId, Constructor } from '../types/index.js' */
import { TypeInfo } from './info.js'
import { typeid } from './typeid.js'

export class TypeRegistry {

  /**
   * @private
   * @type {Map<TypeId,TypeEntry>}
   */
  inner = new Map()
  
  /**
   * @template T
   * @param {Constructor<T>} type
   * @param {TypeInfo} info
   */
  register(type, info) {
    const typeId = typeid(type)

    this.registerTypeId(typeId, info)
  }
  
  /**
   * @param {TypeId} typeId
   * @param {TypeInfo} info
   */
  registerTypeId(typeId, info) {
    const entry = new TypeEntry(info)

    this.inner.set(typeId, entry)
  }
  
  /**
   * @template T
   * @param {Constructor<T>} type
   */
  unregister(type) {
    const typeId = typeid(type)

    this.unregisterTypeId(typeId)
  }
  
  /**
   * @param {TypeId} typeId
   */
  unregisterTypeId(typeId) {
    this.inner.delete(typeId)
  }
  
  /**
   * @template T
   * @param {Constructor<T>} type
   * @returns {TypeEntry | undefined}
   */
  get(type) {
    return this.getByTypeId(typeid(type))
  }
  
  /**
   * @param {TypeId} typeId
   */
  getByTypeId(typeId) {
    return this.inner.get(typeId)
  }
}

export class TypeEntry {

  /**
   * @readonly
   * @type {TypeInfo}
   */
  info

  /**
   * @param {TypeInfo} info
   */
  constructor(info) {
    this.info = info
  }
}