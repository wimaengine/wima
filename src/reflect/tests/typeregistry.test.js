import { test, describe } from "node:test";
import { Field, OpaqueInfo, StructInfo, EnumInfo, FunctionInfo } from "../core/index.js";
import { deepStrictEqual } from "node:assert";
import { setTypeId, typeid, typeidFunction } from "../../type/index.js";
import { TypeRegistry } from "../resources/index.js";

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
  })

  test('`TypeRegistry` registers enum types correctly', () => {
    const typeid = setTypeId("TestEnum")
    const registry = new TypeRegistry()

    registry.registerTypeId(typeid, new EnumInfo(TestEnum))
    deepStrictEqual(registry.getByTypeId(typeid)?.info, new EnumInfo(TestEnum))
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
})
