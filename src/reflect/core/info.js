/** @import { TypeId } from '../types/index.js' */
export class TypeInfo {}

export class Field {

  /**
   * @readonly
   * @type {TypeId}
   */
  type

  /**
   * @readonly
   * @type {boolean}
   */
  optional

  /**
   * @param {TypeId} type
   * @param {boolean} [optional=false]
   */
  constructor(type, optional = false) {
    this.type = type
    this.optional = optional
  }
}

export class OpaqueInfo extends TypeInfo {  
  static default() {
    return new OpaqueInfo()
  }
}

export class StructInfo extends TypeInfo {

  /**
   * @readonly
   * @private
   * @type {Map<string,number>}
   */
  names = new Map()
  
  /**
   * @readonly
   * @private
   * @type {Field[]}
   */
  fields = []
  
  /**
   * @param {Record<string,Field>} record
   */
  constructor(record) {
    super()

    for (const name in record) {
      const position = this.fields.length

      this.names.set(name, position)
      this.fields.push(record[name])
    }
  }
  static default() {
    return new StructInfo({})
  }

  /**
   * @param {string} name
   */
  get(name) {
    const index = this.names.get(name)

    if(index === undefined) return undefined

    return this.getByIndex(index)
  }

  /**
   * @param {number} index
   */
  getByIndex(index) {
    return this.fields[index]
  }
  getFields() {
    return this.fields
  }
  fieldNames() {
    return this.names.keys()
  }
  
  size(){
    return this.fields.length
  }
}