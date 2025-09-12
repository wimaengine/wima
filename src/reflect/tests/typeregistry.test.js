import { test, describe } from "node:test";
import { Field, OpaqueInfo, StructInfo, EnumInfo, typeid, setTypeId, TypeRegistry } from "../core/index.js";
import { deepStrictEqual } from "node:assert";

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

  test('`TypeRegistry` correctly unregisters types', () => {
    const registry = new TypeRegistry()

    registry.register(Number, OpaqueInfo.default())
    registry.unregister(Number)
    deepStrictEqual(registry.get(Number), undefined)
  })
})