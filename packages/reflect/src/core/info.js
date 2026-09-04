/** @import { TypeId } from '@wimaengine/type' */

export class TypeInfo {

  /**
   * @returns {TypeInfoSerial}
   */
  serialize() {
    return TypeInfo.serialize(this)
  }

  /**
   * @param {TypeInfo} _value
   * @returns {TypeInfoSerial}
   */
  static serialize(_value) {
    throw new TypeError('TypeInfo is abstract and cannot be serialized directly')
  }

  /**
   * @param {TypeInfoSerial} _value
   * @param {TypeInfo} [_out]
   * @returns {TypeInfo}
   */
  static deserialize(_value, _out) {
    throw new TypeError('TypeInfo is abstract and cannot be deserialized directly')
  }

  /**
   * @param {unknown} _value
   * @returns {boolean}
   */
  static validateSerial(_value) {
    throw new TypeError('TypeInfo is abstract and cannot validate serials directly')
  }

  /**
   * @param {unknown} _value
   * @returns {boolean}
   */
  static validSerial(_value) {
    throw new TypeError('TypeInfo is abstract and cannot validate serials directly')
  }
}

export class Field {

  /**
   * @type {TypeId}
   */
  type

  /**
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

  /**
   * @returns {FieldSerial}
   */
  serialize() {
    return Field.serialize(this)
  }

  /**
   * @param {Field} value
   * @returns {FieldSerial}
   */
  static serialize(value) {
    return {
      type: value.type,
      optional: value.optional
    }
  }

  /**
   * @param {FieldSerial} value
   * @param {Field} [out]
   * @returns {Field}
   */
  static deserialize(value, out = new Field(value.type, value.optional)) {
    out.type = value.type
    out.optional = value.optional

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is FieldSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('type' in value) || !('optional' in value)) {
      return false
    }

    return typeof value.type === 'string' && typeof value.optional === 'boolean'
  }

}

export class OpaqueInfo extends TypeInfo {

  /**
   * @returns {OpaqueInfoSerial}
   */
  serialize() {
    return OpaqueInfo.serialize(this)
  }

  /**
   * @param {OpaqueInfo} _value
   * @returns {OpaqueInfoSerial}
   */
  static serialize(_value) {
    return {
      kind: 'opaque'
    }
  }

  static default() {
    return new OpaqueInfo()
  }

  /**
   * @param {OpaqueInfoSerial} _value
   * @param {OpaqueInfo} [out]
   * @returns {OpaqueInfo}
   */
  static deserialize(_value, out = new OpaqueInfo()) {
    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is OpaqueInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value)) {
      return false
    }

    return value.kind === 'opaque'
  }
}

export class StructInfo extends TypeInfo {

  /**
   * @private
   * @type {Map<string,number>}
   */
  names = new Map()

  /**
   * @private
   * @type {Field[]}
   */
  fields = []

  /**
   * @param {Record<string,Field>} record
   */
  constructor(record) {
    super()

    for (const [name, value] of Object.entries(record)) {
      const position = this.fields.length

      this.names.set(name, position)
      this.fields.push(value)
    }
  }

  /**
   * @param {string} name
   */
  get(name) {
    const index = this.names.get(name)

    if (index === undefined) return undefined

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

  size() {
    return this.fields.length
  }

  /**
   * @returns {StructInfoSerial}
   */
  serialize() {
    return StructInfo.serialize(this)
  }

  static default() {
    return new StructInfo({})
  }

  /**
   * @param {StructInfo} value
   * @returns {StructInfoSerial}
   */
  static serialize(value) {
    /** @type {Record<string, FieldSerial>} */
    const fields = {}

    for (const name of value.fieldNames()) {
      const field = value.get(name)

      if (field !== undefined) {
        fields[name] = Field.serialize(field)
      }
    }

    return {
      kind: 'struct',
      fields
    }
  }

  /**
   * @param {StructInfoSerial} value
   * @param {StructInfo} [out]
   * @returns {StructInfo}
   */
  static deserialize(value, out = new StructInfo({})) {
    out.names.clear()
    out.fields.length = 0

    for (const [name, fieldSerial] of Object.entries(value.fields)) {
      out.names.set(name, out.fields.length)
      out.fields.push(Field.deserialize(fieldSerial))
    }

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is StructInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('fields' in value)) {
      return false
    }

    if (value.kind !== 'struct' ||
      typeof value.fields !== 'object' ||
      value.fields === null ||
      Array.isArray(value.fields)) {
      return false
    }

    for (const field of Object.values(value.fields)) {
      if (!Field.validateSerial(field)) {
        return false
      }
    }

    return true
  }
}

export class EnumInfo extends TypeInfo {

  /**
   * @type {Map<string,number>}
   */
  variants

  /**
   * @param {Record<string,number>} variants
   */
  constructor(variants) {
    super()
    const map = new Map()

    for (const variant in variants) {
      map.set(variant, variants[variant])
    }

    this.variants = map
  }

  /**
   * @param {string} variant
   * @returns {number | undefined}
   */
  get(variant) {
    return this.variants.get(variant)
  }

  /**
   * @returns {Iterable<string>}
   */
  getVariants() {
    return this.variants.keys()
  }

  /**
   * @yields {MapIterator<[string,number]>}
   */
  * [Symbol.iterator]() {
    return this.variants.entries()
  }

  /**
   * @returns {EnumInfoSerial}
   */
  serialize() {
    return EnumInfo.serialize(this)
  }

  /**
   * @param {EnumInfo} value
   * @returns {EnumInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'enum',
      variants: Object.fromEntries(value.variants)
    }
  }

  /**
   * @param {EnumInfoSerial} value
   * @param {EnumInfo} [out]
   * @returns {EnumInfo}
   */
  static deserialize(value, out = new EnumInfo(value.variants)) {
    out.variants.clear()

    for (const [variant, discriminant] of Object.entries(value.variants)) {
      out.variants.set(variant, discriminant)
    }

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is EnumInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('variants' in value)) {
      return false
    }

    if (value.kind !== 'enum' ||
      typeof value.variants !== 'object' ||
      value.variants === null ||
      Array.isArray(value.variants)) {
      return false
    }

    for (const discriminant of Object.values(value.variants)) {
      if (typeof discriminant !== 'number') {
        return false
      }
    }

    return true
  }
}

export class FunctionInfo extends TypeInfo {

  /**
   * @type {TypeId[]}
   */
  parameterTypes

  /**
   * @type {TypeId}
   */
  returnType

  /**
   * @param {TypeId[]} parameterTypes
   * @param {TypeId} returnType
   */
  constructor(parameterTypes, returnType) {
    super()
    this.parameterTypes = parameterTypes
    this.returnType = returnType
  }

  /**
   * @param {number} index
   * @returns {TypeId | undefined}
   */
  getParameter(index) {
    return this.parameterTypes[index]
  }

  /**
   * @returns {ReadonlyArray<TypeId>}
   */
  getParameters() {
    return this.parameterTypes
  }

  /**
   * @returns {TypeId}
   */
  getReturnType() {
    return this.returnType
  }

  /**
   * @returns {FunctionInfoSerial}
   */
  serialize() {
    return FunctionInfo.serialize(this)
  }

  /**
   * @param {FunctionInfo} value
   * @returns {FunctionInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'function',
      parameterTypes: [...value.parameterTypes],
      returnType: value.returnType
    }
  }

  /**
   * @param {FunctionInfoSerial} value
   * @param {FunctionInfo} [out]
   * @returns {FunctionInfo}
   */
  static deserialize(value, out = new FunctionInfo([...value.parameterTypes], value.returnType)) {
    out.parameterTypes.length = 0
    out.parameterTypes.push(...value.parameterTypes)
    out.returnType = value.returnType

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is FunctionInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('parameterTypes' in value) || !('returnType' in value)) {
      return false
    }

    if (value.kind !== 'function') {
      return false
    }

    if (!Array.isArray(value.parameterTypes)) {
      return false
    }

    if (typeof value.returnType !== 'string') {
      return false
    }

    return value.parameterTypes.every((typeId) => typeof typeId === 'string')
  }
}

export class ArrayInfo extends TypeInfo {

  /**
   * @type {TypeId}
   */
  elementType

  /**
   * @param {TypeId} elementType
   */
  constructor(elementType) {
    super()
    this.elementType = elementType
  }

  /**
   * @returns {TypeId}
   */
  getElementType() {
    return this.elementType
  }

  /**
   * @returns {ArrayInfoSerial}
   */
  serialize() {
    return ArrayInfo.serialize(this)
  }

  /**
   * @param {ArrayInfo} value
   * @returns {ArrayInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'array',
      elementType: value.elementType
    }
  }

  /**
   * @param {ArrayInfoSerial} value
   * @param {ArrayInfo} [out]
   * @returns {ArrayInfo}
   */
  static deserialize(value, out = new ArrayInfo(value.elementType)) {
    out.elementType = value.elementType

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is ArrayInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('elementType' in value)) {
      return false
    }

    return value.kind === 'array' && typeof value.elementType === 'string'
  }
}

export class SetInfo extends TypeInfo {

  /**
   * @type {TypeId}
   */
  elementType

  /**
   * @param {TypeId} elementType
   */
  constructor(elementType) {
    super()
    this.elementType = elementType
  }

  /**
   * @returns {TypeId}
   */
  getElementType() {
    return this.elementType
  }

  /**
   * @returns {SetInfoSerial}
   */
  serialize() {
    return SetInfo.serialize(this)
  }

  /**
   * @param {SetInfo} value
   * @returns {SetInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'set',
      elementType: value.elementType
    }
  }

  /**
   * @param {SetInfoSerial} value
   * @param {SetInfo} [out]
   * @returns {SetInfo}
   */
  static deserialize(value, out = new SetInfo(value.elementType)) {
    out.elementType = value.elementType

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is SetInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('elementType' in value)) {
      return false
    }

    return value.kind === 'set' && typeof value.elementType === 'string'
  }
}

export class MapInfo extends TypeInfo {

  /**
   * @type {TypeId}
   */
  keyType

  /**
   * @type {TypeId}
   */
  valueType

  /**
   * @param {TypeId} keyType
   * @param {TypeId} valueType
   */
  constructor(keyType, valueType) {
    super()
    this.keyType = keyType
    this.valueType = valueType
  }

  /**
   * @returns {TypeId}
   */
  getKeyType() {
    return this.keyType
  }

  /**
   * @returns {TypeId}
   */
  getValueType() {
    return this.valueType
  }

  /**
   * @returns {MapInfoSerial}
   */
  serialize() {
    return MapInfo.serialize(this)
  }

  /**
   * @param {MapInfo} value
   * @returns {MapInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'map',
      keyType: value.keyType,
      valueType: value.valueType
    }
  }

  /**
   * @param {MapInfoSerial} value
   * @param {MapInfo} [out]
   * @returns {MapInfo}
   */
  static deserialize(value, out = new MapInfo(value.keyType, value.valueType)) {
    out.keyType = value.keyType
    out.valueType = value.valueType

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is MapInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('keyType' in value) || !('valueType' in value)) {
      return false
    }

    return value.kind === 'map' &&
      typeof value.keyType === 'string' &&
      typeof value.valueType === 'string'
  }
}

export class TupleInfo extends TypeInfo {

  /**
   * @type {TypeId[]}
   */
  elementTypes

  /**
   * @param {TypeId[]} elementTypes
   */
  constructor(elementTypes) {
    super()
    this.elementTypes = elementTypes
  }

  /**
   * @param {number} index
   * @returns {TypeId | undefined}
   */
  getElement(index) {
    return this.elementTypes[index]
  }

  /**
   * @returns {ReadonlyArray<TypeId>}
   */
  getElements() {
    return this.elementTypes
  }

  /**
   * @returns {TupleInfoSerial}
   */
  serialize() {
    return TupleInfo.serialize(this)
  }

  /**
   * @param {TupleInfo} value
   * @returns {TupleInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'tuple',
      elementTypes: [...value.elementTypes]
    }
  }

  /**
   * @param {TupleInfoSerial} value
   * @param {TupleInfo} [out]
   * @returns {TupleInfo}
   */
  static deserialize(value, out = new TupleInfo([...value.elementTypes])) {
    out.elementTypes.length = 0
    out.elementTypes.push(...value.elementTypes)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is TupleInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('elementTypes' in value)) {
      return false
    }

    if (value.kind !== 'tuple') {
      return false
    }

    return Array.isArray(value.elementTypes) &&
      value.elementTypes.every((typeId) => typeof typeId === 'string')
  }
}

/**
 * @typedef OpaqueInfoSerial
 * @property {'opaque'} kind
 */

/**
 * @typedef FieldSerial
 * @property {TypeId} type
 * @property {boolean} optional
 */

/**
 * @typedef StructInfoSerial
 * @property {'struct'} kind
 * @property {Record<string, FieldSerial>} fields
 */

/**
 * @typedef EnumInfoSerial
 * @property {'enum'} kind
 * @property {Record<string, number>} variants
 */

/**
 * @typedef FunctionInfoSerial
 * @property {'function'} kind
 * @property {TypeId[]} parameterTypes
 * @property {TypeId} returnType
 */

/**
 * @typedef ArrayInfoSerial
 * @property {'array'} kind
 * @property {TypeId} elementType
 */

/**
 * @typedef SetInfoSerial
 * @property {'set'} kind
 * @property {TypeId} elementType
 */

/**
 * @typedef MapInfoSerial
 * @property {'map'} kind
 * @property {TypeId} keyType
 * @property {TypeId} valueType
 */

/**
 * @typedef TupleInfoSerial
 * @property {'tuple'} kind
 * @property {TypeId[]} elementTypes
 */

/**
 * @typedef {OpaqueInfoSerial | StructInfoSerial | EnumInfoSerial | FunctionInfoSerial | ArrayInfoSerial | SetInfoSerial | MapInfoSerial | TupleInfoSerial} TypeInfoSerial
 */
