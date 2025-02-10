import { typeid, TypeInfo } from './values.js';
export class TypeRegistry {
  /**
   * @private
   * @type {Map<TypeId,TypeEntry>}
   */
  inner = new Map()

  /**
   * @template T
   * @param {new () => T} type
   * @param {TypeInfo} info
   */
  register(type,info) {
    const typeId = typeid(type)
    const entry = new TypeEntry(info)
    this.inner.set(typeId, entry)
  }
    
  /**
   * @template T
   * @param {new () => T} type
   * @returns {TypeEntry | undefined}
   */
  get(type){
    return this.inner.get(typeid(type))
  }
}

export class TypeEntry {
  /**
   * @type {TypeInfo}
   */
  info
  constructor(info){
    this.info = info
  }
}