import { test, describe } from "node:test";
import { ArrayInfo } from "../../core/info.js";
import { typeid } from "../../../type/core/typeid.js";
import { strictEqual } from "assert";

describe("Testing `ArrayInfo`", () => {
  test("`ArrayInfo` stores element type", () => {
    const info = new ArrayInfo(typeid(Number))

    strictEqual(info.getElementType(), typeid(Number))
  })
})
