/** @import { TypeId, Constructor } from '../../type/index.js' */
import { TypeInfo } from '../core/info.js'
import { typeid } from '../../type/index.js'

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
   * @private
   * @type {Map<string, MethodEntry>}
   */
  methods = new Map()

  /**
   * @param {TypeInfo} info
   */
  constructor(info) {
    this.info = info
  }

  /**
   * @template {unknown[]} T
   * @param {string} name
   * @param {[...T]} args
   * @returns {unknown}
   */
  call(name, args) {
    const method = this.getMethod(name)

    if (method) {
      return method.call(args)
    }

    return undefined

  }

  /**
   * @param {string} name
   */
  getMethod(name) {
    return this.methods.get(name)
  }

  /**
   * @param {Function} method
   */
  setMethod(method) {
    this.methods.set(method.name, new MethodEntry(method))
  }

  /**
   * @returns {ReadonlyMap<string, readonly MethodEntry>}
   */
  getMethods() {
    return this.methods
  }
}

export class MethodEntry {

  /**
   * @type {Function}
   */
  method

  /**
   * @param {Function} method
   */
  constructor(method) {
    this.method = method
  }

  /**
   * @template {unknown[]} T
   * @param {[...T]} [args]
   * @returns {unknown}
   */
  call(args) {
    return this.method(...(args || []))
  }
}
