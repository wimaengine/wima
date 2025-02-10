const ValueType = {
  Primitive: 0,
  Array: 1,
  Tuple: 2,
  Struct: 3,

}

export class TypeInfo {
  /**
   * @readonly
   * @type {ValueType}
   */
  type
  constructor(type) {
    this.type = type
  }
}

export class Field {
  /**
   * @readonly
   * @type {TypeId}
   */
  type
  /**
   * @type {boolean}
   */
  nullable
  constructor(type, nullable = false) {
    this.type = type
    this.nullable = false
  }
}

export class PrimitiveInfo extends TypeInfo {
  constructor() {
    super(ValueType.Primitive)
  }
}

export class TupleInfo extends TypeInfo {
  /**
   * @readonly
   * @type {Field[]}
   */
  fields = []

  /**
   * @param {Field[]} record
   */
  constructor(record) {
    super(ValueType.Tuple)
    this.fields = record
  }
}

export class ArrayInfo extends TypeInfo {
  /**
   * @readonly
   * @type {Field}
   */
  element_typeid
  constructor() {
    super(ValueType.Array)
  }
}

export class StructInfo extends TypeInfo {
  /**
   * @readonly
   * @type {Map<string,Field>}
   */
  fields = new Map()

  /**
   * @param {Record<string,Field>} record
   */
  constructor(record) {
    for (const name in record) {
      super(ValueType.Struct)
      this.fields.set(name, record[name])
    }
  }

}

/**
 * @typedef {Readonly<string>} TypeId
 */

/**
 * @template T
 * @param {new ()=> T} type
 * @returns {TypeId}
 */
export function typeid(type) {
  return type.name
}