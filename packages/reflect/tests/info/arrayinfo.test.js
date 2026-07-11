import { test, describe } from "vitest";
import { ArrayInfo } from "../../src/core";
import { typeid } from "@wimaengine/type";
import { strictEqual } from "assert";

describe("Testing `ArrayInfo`", () => {
  test("`ArrayInfo` stores element type", () => {
    const info = new ArrayInfo(typeid(Number))

    strictEqual(info.getElementType(), typeid(Number))
  })
})
