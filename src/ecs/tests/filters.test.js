import { test, describe } from "node:test";
import { has, without } from "../index.js";
import { strictEqual } from "node:assert";
import { typeid } from "../../type/index.js";

describe("Testing query filters", () => {
  test('Testing `With` filter.', () => {
    const filter = has(A)
    const archetype1 = [typeid(A),typeid(B),typeid(C)]
    const archetype2 = [typeid(B),typeid(C)]

    strictEqual(filter.archetype(archetype1),true)
    strictEqual(filter.archetype(archetype2),false)
  })

  test('Testing `Without` filter.', () => {
    const filter = without(A)
    const archetype1 = [typeid(A),typeid(B),typeid(C)]
    const archetype2 = [typeid(B),typeid(C)]

    strictEqual(filter.archetype(archetype1),false)
    strictEqual(filter.archetype(archetype2),true)
  })
})

class A { }
class B { }
class C { }