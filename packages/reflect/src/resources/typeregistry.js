/** @import { TypeId, Constructor } from '@wimaengine/type' */
/** @import { TypeInfoSerial } from '../core' */
import { setTypeId, typeid } from '@wimaengine/type'
import {
  ArrayInfo,
  EnumInfo,
  FunctionInfo,
  MapInfo,
  OpaqueInfo,
  SetInfo,
  StructInfo,
  TupleInfo,
  TypeInfo
} from '../core'

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

    this.registerTypeId(typeId, info, type)
  }

  /**
   * @param {TypeId} typeId
   * @param {TypeInfo} info
   * @param {Constructor | undefined} [constructorFn]
   */
  registerTypeId(typeId, info, constructorFn) {
    const entry = new TypeEntry(info, constructorFn)

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

  /**
   * @param {TypeRegistry} value
   * @returns {TypeRegistrySerial}
   */
  static serialize(value) {

    /** @type {TypeRegistrySerial} */
    const serial = {}

    for (const [typeId, entry] of value.inner) {
      serial[typeId] = entry.serialize()
    }

    return serial
  }

  /**
   * @param {TypeRegistrySerial} value
   * @param {TypeRegistry} [out]
   * @returns {TypeRegistry}
   */
  static deserialize(value, out = new TypeRegistry()) {
    out.inner.clear()

    for (const [typeId, info] of Object.entries(value)) {
      out.registerTypeId(setTypeId(typeId), TypeEntry.deserialize(info))
    }

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is TypeRegistrySerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false
    }

    for (const info of Object.values(value)) {
      if (!TypeEntry.validateSerial(info)) {
        return false
      }
    }

    return true
  }
}

export class TypeEntry {

  /**
   * @type {TypeInfo}
   */
  info

  /**
   * @type {Constructor | undefined}
   */
  constructorFn

  /**
   * @private
   * @type {Map<string, MethodEntry>}
   */
  methods = new Map()

  /**
   * @param {TypeInfo} info
   * @param {Constructor | undefined} [constructorFn]
   */
  constructor(info, constructorFn) {
    this.info = info
    this.constructorFn = constructorFn
  }

  /**
   * @returns {TypeInfoSerial}
   */
  serialize() {
    return this.info.serialize()
  }

  /**
   * @param {TypeInfo} value
   * @returns {TypeInfoSerial}
   * @throws {TypeError} If `value` is not a supported `TypeInfo` subtype.
   */
  static serialize(value) {
    if (value instanceof OpaqueInfo) {
      return OpaqueInfo.serialize(value)
    }

    if (value instanceof StructInfo) {
      return StructInfo.serialize(value)
    }

    if (value instanceof EnumInfo) {
      return EnumInfo.serialize(value)
    }

    if (value instanceof FunctionInfo) {
      return FunctionInfo.serialize(value)
    }

    if (value instanceof ArrayInfo) {
      return ArrayInfo.serialize(value)
    }

    if (value instanceof SetInfo) {
      return SetInfo.serialize(value)
    }

    if (value instanceof MapInfo) {
      return MapInfo.serialize(value)
    }

    if (value instanceof TupleInfo) {
      return TupleInfo.serialize(value)
    }

    throw new TypeError(`Unsupported TypeInfo: ${value?.constructor?.name || 'unknown'}`)
  }

  /**
   * @param {TypeInfoSerial} value
   * @param {TypeInfo} [out]
   * @returns {TypeInfo}
   * @throws {TypeError} If `value` is not a supported `TypeInfoSerial` kind.
   */
  static deserialize(value, out) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value)) {
      throw new TypeError('Unsupported TypeInfo serial kind')
    }

    switch (value.kind) {
      case 'opaque':
        return out instanceof OpaqueInfo ?
          OpaqueInfo.deserialize(value, out) :
          OpaqueInfo.deserialize(value)

      case 'struct':
        return out instanceof StructInfo ?
          StructInfo.deserialize(value, out) :
          StructInfo.deserialize(value)

      case 'enum':
        return out instanceof EnumInfo ?
          EnumInfo.deserialize(value, out) :
          EnumInfo.deserialize(value)

      case 'function':
        return out instanceof FunctionInfo ?
          FunctionInfo.deserialize(value, out) :
          FunctionInfo.deserialize(value)

      case 'array':
        return out instanceof ArrayInfo ?
          ArrayInfo.deserialize(value, out) :
          ArrayInfo.deserialize(value)

      case 'set':
        return out instanceof SetInfo ?
          SetInfo.deserialize(value, out) :
          SetInfo.deserialize(value)

      case 'map':
        return out instanceof MapInfo ?
          MapInfo.deserialize(value, out) :
          MapInfo.deserialize(value)

      case 'tuple':
        return out instanceof TupleInfo ?
          TupleInfo.deserialize(value, out) :
          TupleInfo.deserialize(value)

      default:
        throw new TypeError('Unsupported TypeInfo serial kind')
    }
  }

  /**
   * @param {unknown} value
   * @returns {value is TypeInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value)) {
      return false
    }

    switch (value.kind) {
      case 'opaque':
        return OpaqueInfo.validateSerial(value)

      case 'struct':
        return StructInfo.validateSerial(value)

      case 'enum':
        return EnumInfo.validateSerial(value)

      case 'function':
        return FunctionInfo.validateSerial(value)

      case 'array':
        return ArrayInfo.validateSerial(value)

      case 'set':
        return SetInfo.validateSerial(value)

      case 'map':
        return MapInfo.validateSerial(value)

      case 'tuple':
        return TupleInfo.validateSerial(value)

      default:
        return false
    }
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

/**
 * @typedef {Record<string, TypeInfoSerial>} TypeRegistrySerial
 */
