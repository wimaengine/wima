import { test, describe } from "node:test";
import { MapInfo } from "../../core/info.js";
import { typeid } from "../../../type/core/typeid.js";
import { strictEqual } from "assert";

describe("Testing `MapInfo`", () => {
  test("`MapInfo` stores key and value types", () => {
    const info = new MapInfo(typeid(String), typeid(Number))

    strictEqual(info.getKeyType(), typeid(String))
    strictEqual(info.getValueType(), typeid(Number))
  })
})
