import { test, describe } from "node:test";
import { Field, StructInfo } from "../../core/info.js";
import { typeid } from "../../core/typeid.js";
import { deepStrictEqual, strictEqual } from "assert";

describe("Testing `StructInfo`", () => {
  test('`StructInfo` has correct fields', () => {
    const info = new StructInfo({
      id: new Field(typeid(Number)),
      name: new Field(typeid(String))
    })

    deepStrictEqual(info.getFields(), [new Field(typeid(Number)), new Field(typeid(String))])
  })

  test('`StructInfo` gets correct field by index', () => {
    const info = new StructInfo({
      id: new Field(typeid(Number)),
      name: new Field(typeid(String))
    })

    deepStrictEqual(info.getByIndex(0),new Field((typeid(Number))))
    deepStrictEqual(info.getByIndex(1),new Field((typeid(String))))
  })

  test('`StructInfo` gets correct field by name', () => {
    const info = new StructInfo({
      id: new Field(typeid(Number)),
      name: new Field(typeid(String))
    })

    deepStrictEqual(info.get("id"),new Field((typeid(Number))))
    deepStrictEqual(info.get("name"),new Field((typeid(String))))
  })

  test('`StructInfo` sets optional field correctly', () => {
    const info = new StructInfo({
      id: new Field(typeid(Number)),
      name: new Field(typeid(String),true)
    })

    strictEqual(info.get("id")?.optional,false)
    strictEqual(info.get("name")?.optional,true)
  })

  test('`StructInfo` gets correct names', () => {
    const info = new StructInfo({
      id: new Field(typeid(Number)),
      name: new Field(typeid(String))
    })

    deepStrictEqual([...info.fieldNames()],["id","name"])
  })

  test('`StructInfo` gets correct size', () => {
    const info = new StructInfo({
      id:new Field(typeid(Number)),
      name:new Field(typeid(String))
    })

    strictEqual(info.size(),2)
  })
})