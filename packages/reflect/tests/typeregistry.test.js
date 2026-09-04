import { test, describe } from "vitest";
import { deepStrictEqual, strictEqual, throws } from "node:assert";
import { Field, OpaqueInfo, StructInfo, EnumInfo, FunctionInfo, ArrayInfo, SetInfo, MapInfo, TupleInfo, TypeInfo } from "../src/core";
import { setTypeId, typeid, typeidFunction } from "@wimaengine/type";
import { TypeEntry, TypeRegistry } from "../src/resources";

describe("Testing `TypeRegistry`", () => {
  const TestEnum = {
    Variant1: 0,
    Variant2: 1
  }
  test('`TypeRegistry` registers opaque type correctly', () => {
    const registry = new TypeRegistry()

    registry.register(Number, OpaqueInfo.default())
    deepStrictEqual(registry.get(Number)?.info, OpaqueInfo.default())
  })

  test('`TypeRegistry` registers ZST correctly', () => {
    class ZST { }
    const registry = new TypeRegistry()

    registry.register(ZST, StructInfo.default())
    deepStrictEqual(registry.get(ZST)?.info, StructInfo.default())
  })

  test('`TypeRegistry` registers class type correctly', () => {
    class Test {
      age = 0
    }
    const registry = new TypeRegistry()

    registry.register(Test, new StructInfo({
      age: new Field(typeid(Number))
    }))
    deepStrictEqual(registry.get(Test)?.info, new StructInfo({
      age: new Field(typeid(Number))
    }))
    strictEqual(registry.get(Test)?.constructorFn, Test)
  })

  test('`TypeRegistry` registers enum types correctly', () => {
    const typeid = setTypeId("TestEnum")
    const registry = new TypeRegistry()

    registry.registerTypeId(typeid, new EnumInfo(TestEnum))
    deepStrictEqual(registry.getByTypeId(typeid)?.info, new EnumInfo(TestEnum))
    strictEqual(registry.getByTypeId(typeid)?.constructorFn, undefined)
  })

  test('`TypeRegistry` registers function info by type id', () => {
    class A {
      value = ""
    }
    /**
     * @param {A} _a
     * @param {boolean} _b
     * @returns 
     */
    function marr(_a, _b) {
      return ""
    }
    // @ts-ignore
    const id = typeidFunction(marr,[A, Boolean], String)
    const registry = new TypeRegistry()

    registry.registerTypeId(id, new FunctionInfo([typeid(Number), typeid(String)], typeid(Boolean)))
    deepStrictEqual(
      registry.getByTypeId(id)?.info,
      new FunctionInfo([typeid(Number), typeid(String)], typeid(Boolean))
    )
  })

  test('`TypeRegistry` correctly unregisters types', () => {
    const registry = new TypeRegistry()

    registry.register(Number, OpaqueInfo.default())
    registry.unregister(Number)
    deepStrictEqual(registry.get(Number), undefined)
  })

  test('`TypeRegistry` correctly unregisters type ids', () => {
    const registry = new TypeRegistry()
    const id = setTypeId("ManualId")

    registry.registerTypeId(id, OpaqueInfo.default())
    registry.unregisterTypeId(id)
    deepStrictEqual(registry.getByTypeId(id), undefined)
  })

  test('`TypeRegistry` can retrieve by type id for classes', () => {
    class Test { }
    const registry = new TypeRegistry()
    const id = typeid(Test)

    registry.register(Test, StructInfo.default())
    deepStrictEqual(registry.getByTypeId(id)?.info, StructInfo.default())
  })

  test("serializes and deserializes type info schema", () => {
    const registry = new TypeRegistry()
    const typeIdByName = {
      opaque: setTypeId(OpaqueInfo.name),
      struct: setTypeId(StructInfo.name),
      enum: setTypeId(EnumInfo.name),
      function: setTypeId(FunctionInfo.name),
      array: setTypeId(ArrayInfo.name),
      set: setTypeId(SetInfo.name),
      map: setTypeId(MapInfo.name),
      tuple: setTypeId(TupleInfo.name)
    }

    registry.registerTypeId(typeIdByName.opaque, OpaqueInfo.default())
    registry.registerTypeId(typeIdByName.struct, new StructInfo({
      age: new Field(typeid(Number)),
      name: new Field(typeid(String), true)
    }))
    registry.registerTypeId(typeIdByName.enum, new EnumInfo({
      Variant1: 0,
      Variant2: 1
    }))
    registry.registerTypeId(typeIdByName.function, new FunctionInfo([typeid(Number), typeid(String)], typeid(Boolean)))
    registry.registerTypeId(typeIdByName.array, new ArrayInfo(typeid(Number)))
    registry.registerTypeId(typeIdByName.set, new SetInfo(typeid(String)))
    registry.registerTypeId(typeIdByName.map, new MapInfo(typeid(String), typeid(Number)))
    registry.registerTypeId(typeIdByName.tuple, new TupleInfo([typeid(Number), typeid(String)]))

    const registrySerial = TypeRegistry.serialize(registry)
    const restoredRegistry = TypeRegistry.deserialize(registrySerial)

    strictEqual(TypeRegistry.validateSerial(registrySerial), true)
    deepStrictEqual(registrySerial, {
      [typeIdByName.opaque]: {
        kind: 'opaque'
      },
      [typeIdByName.struct]: {
        kind: 'struct',
        fields: {
          age: {
            type: typeid(Number),
            optional: false
          },
          name: {
            type: typeid(String),
            optional: true
          }
        }
      },
      [typeIdByName.enum]: {
        kind: 'enum',
        variants: {
          Variant1: 0,
          Variant2: 1
        }
      },
      [typeIdByName.function]: {
        kind: 'function',
        parameterTypes: [typeid(Number), typeid(String)],
        returnType: typeid(Boolean)
      },
      [typeIdByName.array]: {
        kind: 'array',
        elementType: typeid(Number)
      },
      [typeIdByName.set]: {
        kind: 'set',
        elementType: typeid(String)
      },
      [typeIdByName.map]: {
        kind: 'map',
        keyType: typeid(String),
        valueType: typeid(Number)
      },
      [typeIdByName.tuple]: {
        kind: 'tuple',
        elementTypes: [typeid(Number), typeid(String)]
      }
    })
    deepStrictEqual(restoredRegistry.getByTypeId(typeIdByName.opaque)?.info, OpaqueInfo.default())
    deepStrictEqual(restoredRegistry.getByTypeId(typeIdByName.struct)?.info, new StructInfo({
      age: new Field(typeid(Number)),
      name: new Field(typeid(String), true)
    }))
    deepStrictEqual(restoredRegistry.getByTypeId(typeIdByName.enum)?.info, new EnumInfo({
      Variant1: 0,
      Variant2: 1
    }))
    deepStrictEqual(restoredRegistry.getByTypeId(typeIdByName.function)?.info, new FunctionInfo([typeid(Number), typeid(String)], typeid(Boolean)))
    deepStrictEqual(restoredRegistry.getByTypeId(typeIdByName.array)?.info, new ArrayInfo(typeid(Number)))
    deepStrictEqual(restoredRegistry.getByTypeId(typeIdByName.set)?.info, new SetInfo(typeid(String)))
    deepStrictEqual(restoredRegistry.getByTypeId(typeIdByName.map)?.info, new MapInfo(typeid(String), typeid(Number)))
    deepStrictEqual(restoredRegistry.getByTypeId(typeIdByName.tuple)?.info, new TupleInfo([typeid(Number), typeid(String)]))
  })
})

describe("Testing `TypeInfo` serialization", () => {
  test("round-trips OpaqueInfo", () => {
    const info = OpaqueInfo.default()
    const serial = {
      kind: 'opaque'
    }

    deepStrictEqual(TypeEntry.serialize(info), serial)
    deepStrictEqual(info.serialize(), serial)
    strictEqual(TypeEntry.validateSerial(serial), true)
    strictEqual(OpaqueInfo.validateSerial(serial), true)
    deepStrictEqual(TypeEntry.deserialize(serial), info)
    deepStrictEqual(OpaqueInfo.deserialize(serial), info)
  })

  test("round-trips StructInfo", () => {
    const info = new StructInfo({
      age: new Field(typeid(Number)),
      name: new Field(typeid(String), true)
    })
    const serial = {
      kind: 'struct',
      fields: {
        age: {
          type: typeid(Number),
          optional: false
        },
        name: {
          type: typeid(String),
          optional: true
        }
      }
    }

    deepStrictEqual(TypeEntry.serialize(info), serial)
    deepStrictEqual(info.serialize(), serial)
    strictEqual(TypeEntry.validateSerial(serial), true)
    strictEqual(StructInfo.validateSerial(serial), true)
    deepStrictEqual(TypeEntry.deserialize(serial), info)
    deepStrictEqual(StructInfo.deserialize(serial), info)
  })

  test("round-trips EnumInfo", () => {
    const info = new EnumInfo({
      Variant1: 0,
      Variant2: 1
    })
    const serial = {
      kind: 'enum',
      variants: {
        Variant1: 0,
        Variant2: 1
      }
    }

    deepStrictEqual(TypeEntry.serialize(info), serial)
    deepStrictEqual(info.serialize(), serial)
    strictEqual(TypeEntry.validateSerial(serial), true)
    strictEqual(EnumInfo.validateSerial(serial), true)
    deepStrictEqual(TypeEntry.deserialize(serial), info)
    deepStrictEqual(EnumInfo.deserialize(serial), info)
  })

  test("round-trips FunctionInfo", () => {
    const info = new FunctionInfo([typeid(Number), typeid(String)], typeid(Boolean))
    const serial = {
      kind: 'function',
      parameterTypes: [typeid(Number), typeid(String)],
      returnType: typeid(Boolean)
    }

    deepStrictEqual(TypeEntry.serialize(info), serial)
    deepStrictEqual(info.serialize(), serial)
    strictEqual(TypeEntry.validateSerial(serial), true)
    strictEqual(FunctionInfo.validateSerial(serial), true)
    deepStrictEqual(TypeEntry.deserialize(serial), info)
    deepStrictEqual(FunctionInfo.deserialize(serial), info)
  })

  test("round-trips ArrayInfo", () => {
    const info = new ArrayInfo(typeid(Number))
    const serial = {
      kind: 'array',
      elementType: typeid(Number)
    }

    deepStrictEqual(TypeEntry.serialize(info), serial)
    deepStrictEqual(info.serialize(), serial)
    strictEqual(TypeEntry.validateSerial(serial), true)
    strictEqual(ArrayInfo.validateSerial(serial), true)
    deepStrictEqual(TypeEntry.deserialize(serial), info)
    deepStrictEqual(ArrayInfo.deserialize(serial), info)
  })

  test("round-trips SetInfo", () => {
    const info = new SetInfo(typeid(String))
    const serial = {
      kind: 'set',
      elementType: typeid(String)
    }

    deepStrictEqual(TypeEntry.serialize(info), serial)
    deepStrictEqual(info.serialize(), serial)
    strictEqual(TypeEntry.validateSerial(serial), true)
    strictEqual(SetInfo.validateSerial(serial), true)
    deepStrictEqual(TypeEntry.deserialize(serial), info)
    deepStrictEqual(SetInfo.deserialize(serial), info)
  })

  test("round-trips MapInfo", () => {
    const info = new MapInfo(typeid(String), typeid(Number))
    const serial = {
      kind: 'map',
      keyType: typeid(String),
      valueType: typeid(Number)
    }

    deepStrictEqual(TypeEntry.serialize(info), serial)
    deepStrictEqual(info.serialize(), serial)
    strictEqual(TypeEntry.validateSerial(serial), true)
    strictEqual(MapInfo.validateSerial(serial), true)
    deepStrictEqual(TypeEntry.deserialize(serial), info)
    deepStrictEqual(MapInfo.deserialize(serial), info)
  })

  test("round-trips TupleInfo", () => {
    const info = new TupleInfo([typeid(Number), typeid(String)])
    const serial = {
      kind: 'tuple',
      elementTypes: [typeid(Number), typeid(String)]
    }

    deepStrictEqual(TypeEntry.serialize(info), serial)
    deepStrictEqual(info.serialize(), serial)
    strictEqual(TypeEntry.validateSerial(serial), true)
    strictEqual(TupleInfo.validateSerial(serial), true)
    deepStrictEqual(TypeEntry.deserialize(serial), info)
    deepStrictEqual(TupleInfo.deserialize(serial), info)
  })

  test("`TypeInfo` base methods throw", () => {
    const info = OpaqueInfo.default()
    const serial = {
      kind: 'opaque'
    }

    throws(() => TypeInfo.serialize(info))
    throws(() => TypeInfo.deserialize(serial))
    throws(() => TypeInfo.validateSerial(serial))
  })

  test("rejects invalid type info serials", () => {
    strictEqual(TypeEntry.validateSerial({
      kind: 'struct',
      fields: {
        age: {
          type: 42,
          optional: false
        }
      }
    }), false)
  })
})
