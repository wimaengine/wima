import { test, describe } from "node:test";
import { FunctionInfo } from "../../core/info.js";
import { typeid } from "../../core/typeid.js";
import { deepStrictEqual, strictEqual } from "assert";

describe("Testing `FunctionInfo`", () => {
  test("`FunctionInfo` stores parameter and return types", () => {
    const info = new FunctionInfo([typeid(Number), typeid(String)], typeid(Boolean))

    deepStrictEqual(info.parameterTypes, [typeid(Number), typeid(String)])
    strictEqual(info.returnType, typeid(Boolean))
  })

  test("`FunctionInfo` gets correct parameter by index", () => {
    const info = new FunctionInfo([typeid(Number), typeid(String)], typeid(Boolean))

    strictEqual(info.getParameter(0), typeid(Number))
    strictEqual(info.getParameter(1), typeid(String))
  })

  test("`FunctionInfo` iterates parameters", () => {
    const info = new FunctionInfo([typeid(Number), typeid(String)], typeid(Boolean))

    deepStrictEqual([...info.getParameters()], [typeid(Number), typeid(String)])
  })

  test("`FunctionInfo` returns return type", () => {
    const info = new FunctionInfo([typeid(Number)], typeid(String))

    strictEqual(info.getReturnType(), typeid(String))
  })
})
