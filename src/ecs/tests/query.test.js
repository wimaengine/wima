import { test, describe } from "node:test";
import { Entity, Query, World } from "../index.js";
import assert, { strictEqual } from "node:assert";
import { typeid } from "../../reflect/index.js";

describe("Testing `Query`", () => {
  test('query for single component, single entity', () => {
    const world = createWorld()
    const query = new Query(world, [A])
    const components = query.single()

    assert(components)

    const [componentA] = components
    strictEqual(
      typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentA.constructor)),
      typeid(A)
    )
  })

  test('query for multiple components, single entity', () => {
    const world = createWorld()
    const query = new Query(world, [A, B, C])
    const components = query.single()

    assert(components)

    const [componentA, componentB, componentC] = components
    strictEqual(
      typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentA.constructor)),
      typeid(A)
    )
    strictEqual(
      typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentB.constructor)),
      typeid(B)
    )
    strictEqual(
      typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentC.constructor)),
      typeid(C)
    )
  })

  test('query for single component, multiple entities', () => {
    const world = createWorld()
    const query = new Query(world, [A])

    query.each(([component]) => {
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(component.constructor)),
        typeid(A)
      )
    })
  })

  test('query for multiple components, multiple entities', () => {
    const world = createWorld()
    const query = new Query(world, [A, B, C])

    query.each(([componentA, componentB, componentC]) => {
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentA.constructor)),
        typeid(A)
      )
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentB.constructor)),
        typeid(B)
      )
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentC.constructor)),
        typeid(C)
      )
    })
  })

  test('query for single component, specific entity', () => {
    const world = createWorld()
    const query = new Query(world, [A])
    const entity = new Entity(0)
    const components = query.get(entity)
    assert(components)

    const [componentA] = components
    strictEqual(
      typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentA.constructor)),
      typeid(A)
    )
  })

  test('query for multiple components, specific entity', () => {
    const world = createWorld()
    const query = new Query(world, [A, B, C])
    const entity = new Entity(0)
    const components = query.get(entity)

    assert(components)

    const [componentA, componentB, componentC] = components
    strictEqual(
      typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentA.constructor)),
      typeid(A)
    )
    strictEqual(
      typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentB.constructor)),
      typeid(B)
    )
    strictEqual(
      typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentC.constructor)),
      typeid(C)
    )
  })

  test('query for combination of entities', () => {
    const world = createWorld()
    const query = new Query(world, [A, B, C])
    let count = 0

    query.eachCombination(([componentA1, componentB1, componentC1],[componentA2, componentB2, componentC2]) => {
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentA1.constructor)),
        typeid(A)
      )
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentB1.constructor)),
        typeid(B)
      )
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentC1.constructor)),
        typeid(C)
      )

      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentA2.constructor)),
        typeid(A)
      )
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentB2.constructor)),
        typeid(B)
      )
      strictEqual(
        typeid(/**@type {import("../../reflect/index.js").Constructor}*/(componentC2.constructor)),
        typeid(C)
      )
      count += 1
    })

    // nCr where n = 10 and r = 2, combinatorial
    strictEqual(count,45)
  })

  test('query for count of entities+', () => {
    const world = createWorld()
    const query = new Query(world, [A])

    strictEqual(query.count(), 30)
  })
})

class A {
  /**
   * @param {number} [id]
   */
  constructor(id) {
    this.id = id
  }
}
class B {
  /**
   * @param {number} [id]
   */
  constructor(id) {
    this.id = id
  }
}
class C { }

function createWorld() {
  const world = new World()

  for (let i = 20; i < 30; i++) {
    world.spawn([new A(i), new B(i), new C()])
  }
  for (let i = 10; i < 20; i++) {
    world.spawn([new A(i), new B(i)])
  }
  for (let i = 0; i < 10; i++) {
    world.spawn([new A(i)])
  }
  for (let i = 0; i < 10; i++) {
    world.spawn([new B(i)])
  }
  for (let i = 0; i < 10; i++) {
    world.spawn([new C()])
  }

  return world
}