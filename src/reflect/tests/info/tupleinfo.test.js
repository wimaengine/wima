import { test, describe } from "node:test";
import { TupleInfo } from "../../core/info.js";
import { typeid } from "../../../type/core/typeid.js";
import { deepStrictEqual, strictEqual } from "assert";

describe("Testing `TupleInfo`", () => {
  test("`TupleInfo` stores element types", () => {
    const info = new TupleInfo([typeid(Number), typeid(String)])

    deepStrictEqual(info.getElements(), [typeid(Number), typeid(String)])
  })

  test("`TupleInfo` gets element by index", () => {
    const info = new TupleInfo([typeid(Number), typeid(String)])

    strictEqual(info.getElement(0), typeid(Number))
    strictEqual(info.getElement(1), typeid(String))
  })
})
