import { test, describe } from "vitest";
import { SetInfo } from "../../src/core";
import { typeid } from "@wimaengine/type";
import { strictEqual } from "assert";

describe("Testing `SetInfo`", () => {
  test("`SetInfo` stores element type", () => {
    const info = new SetInfo(typeid(String))

    strictEqual(info.getElementType(), typeid(String))
  })
})
