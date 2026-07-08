import { test, describe } from "vitest";
import { MapInfo } from "../../src/core";
import { typeid } from "@wimaengine/type";
import { strictEqual } from "assert";

describe("Testing `MapInfo`", () => {
  test("`MapInfo` stores key and value types", () => {
    const info = new MapInfo(typeid(String), typeid(Number))

    strictEqual(info.getKeyType(), typeid(String))
    strictEqual(info.getValueType(), typeid(Number))
  })
})
