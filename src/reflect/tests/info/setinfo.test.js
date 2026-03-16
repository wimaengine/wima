import { test, describe } from "node:test";
import { SetInfo } from "../../core/info.js";
import { typeid } from "../../../type/core/typeid.js";
import { strictEqual } from "assert";

describe("Testing `SetInfo`", () => {
  test("`SetInfo` stores element type", () => {
    const info = new SetInfo(typeid(String))

    strictEqual(info.getElementType(), typeid(String))
  })
})
