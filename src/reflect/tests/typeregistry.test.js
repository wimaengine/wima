import { test, describe } from "node:test";
import { Field, OpaqueInfo, StructInfo, typeid, TypeRegistry } from "../core/index.js";
import { deepStrictEqual } from "node:assert";

describe("Testing `TypeRegistry`", () => {
  test('`TypeRegistry` registers opaque type correctly', () => {
    const registry = new TypeRegistry()
    
    registry.register(Number, OpaqueInfo.default())
    deepStrictEqual(registry.get(Number)?.info, OpaqueInfo.default())
  })
  
  test('`TypeRegistry` registers ZST correctly', () => {
    class ZST {}
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
      age:new Field(typeid(Number))
    }))
    deepStrictEqual(registry.get(Test)?.info, new StructInfo({
      age:new Field(typeid(Number))
    }))
  })

  test('`TypeRegistry` correctly unregisters types', () => {
    const registry = new TypeRegistry()
    
    registry.register(Number, OpaqueInfo.default())
    registry.unregister(Number)
    deepStrictEqual(registry.get(Number), undefined)
  })
})