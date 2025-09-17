import { test, describe } from "node:test";
import { EnumInfo } from "../../core/info.js";
import { deepStrictEqual } from "assert";

describe("Testing `EnumInfo`", () => {
  const TestEnum = {
    Variant1: 0,
    Variant2: 1
  }
  
  test('`EnumInfo` has correct variants', () => {
    const info = new EnumInfo(TestEnum)
    
    deepStrictEqual([...info.getVariants()], ["Variant1", "Variant2"])
  })
  
  test('`EnumInfo` gets correct variant discriminant', () => {
    const info = new EnumInfo(TestEnum)
    
    deepStrictEqual(info.get("Variant1"), TestEnum.Variant1)
    deepStrictEqual(info.get("Variant2"), TestEnum.Variant2)
  })
})