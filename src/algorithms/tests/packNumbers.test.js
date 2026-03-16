import { test, describe } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { packInto64Int, unpackFrom64Int } from "../packnumber.js";

describe("Testing pack and unpacking numbers", () => {
  test('Testing packing number.', () => {
    const num1 = packInto64Int(0, 0)
    const num2 = packInto64Int(1, 0)
    const num3 = packInto64Int(3, 0)
    const num4 = packInto64Int(0, 1)
    const num5 = packInto64Int(1, 1)
    const num6 = packInto64Int(4, 1)
    const num7 = packInto64Int(0, 3)
    const num8 = packInto64Int(2, 3)

    strictEqual(num1, 0)
    strictEqual(num2, 1)
    strictEqual(num3, 3)
    strictEqual(num4, 4294967296)
    strictEqual(num5, 4294967297)
    strictEqual(num6, 4294967300)
    strictEqual(num7, 12884901888)
    strictEqual(num8, 12884901890)
  })

  test('Testing unpacking number.', () => {
    const num1 = unpackFrom64Int(0)
    const num2 = unpackFrom64Int(1)
    const num3 = unpackFrom64Int(3)
    const num4 = unpackFrom64Int(4294967296)
    const num5 = unpackFrom64Int(4294967297)
    const num6 = unpackFrom64Int(4294967300)
    const num7 = unpackFrom64Int(12884901888)
    const num8 = unpackFrom64Int(12884901890)

    deepStrictEqual(num1, [0, 0])
    deepStrictEqual(num2, [1, 0])
    deepStrictEqual(num3, [3, 0])
    deepStrictEqual(num4, [0, 1])
    deepStrictEqual(num5, [1, 1])
    deepStrictEqual(num6, [4, 1])
    deepStrictEqual(num7, [0, 3])
    deepStrictEqual(num8, [2, 3])
    
  })
})