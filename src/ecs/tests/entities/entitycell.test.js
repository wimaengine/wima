import { test, describe } from "node:test";
import { Entity, World } from "../../index.js";
import { deepStrictEqual } from "assert";
import { typeid } from "../../../reflect/index.js";

describe("Testing `EntityCell`", () => {
  test('`EntityCell` gets correct component ids', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B(), new C()])
    const cell = world.getEntity(entity)
    deepStrictEqual(cell.components(), [typeid(A), typeid(B), typeid(C), typeid(Entity)])
  })

  test('`EntityCell` gets correct component', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B()])
    const cell = world.getEntity(entity)
    deepStrictEqual(cell.get(A), new A())
    deepStrictEqual(cell.get(B), new B())
    deepStrictEqual(cell.get(C), undefined)
  })

  test('`EntityCell` tests returns correct id.', () => {
    const world = new World()
    const entity1 = world.spawn([new A(), new B()])
    const entity2 = world.spawn([])

    const cell1 = world.getEntity(entity1)
    const cell2 = world.getEntity(entity2)

    deepStrictEqual(cell1.id(), new Entity(0))
    deepStrictEqual(cell2.id(), new Entity(1))
  })

  test('`EntityCell` tests entity existence correctly.', () => {
    const world = new World()
    const entity1 = world.spawn([new A(), new B()])
    const entity2 = world.spawn([])

    world.despawn(entity2)

    const cell1 = world.getEntity(entity1)
    const cell2 = world.getEntity(entity2)

    deepStrictEqual(cell1.exists(), true)
    deepStrictEqual(cell2.exists(), false)
  })

  test('`EntityCell` existence of a component on entity correctly.', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B()])

    const cell = world.getEntity(entity)

    deepStrictEqual(cell.has([A]), true)
    deepStrictEqual(cell.has([B]), true)
    deepStrictEqual(cell.has([A, B]), true)
    deepStrictEqual(cell.has([C]), false)
    deepStrictEqual(cell.has([A, B, C]), false)
  })
})

class A { }
class B { }
class C { }