import { test, describe } from "node:test";
import { deepStrictEqual } from "node:assert";
import { World } from "../registry.js";
import { typeid } from "../../reflect/index.js";
import { Entity } from "../entities/entity.js";
class A { 
  number = 0
}
class B {
  number = 1
}
class C {
  number = 2
}
class TestResource {
  id = 12
}

class TestAlias extends TestResource {}

describe("Testing `World`", () => {
  test('Entity is spawned correctly into a world.', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B(), new C()])
    const entityCell = world.getEntity(entity)
    const components = [...entityCell.components()]

    deepStrictEqual(components,[typeid(A),typeid(B),typeid(C),typeid(Entity)])
  })

  test('Entity is despawned correctly from a world.', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B(), new C()])
    world.despawn(entity)
    const entityCell = world.getEntity(entity)
    const components = [...entityCell.components()]

    deepStrictEqual(components,[])
  })

  test('Components are inserted into an entity.', () => {
    const world = new World()
    const entity = world.spawn([])
    world.insert(entity, [new A(), new B(), new C()])
    const entityCell = world.getEntity(entity)
    const components = [...entityCell.components()]

    deepStrictEqual(components,[typeid(Entity),typeid(A),typeid(B),typeid(C)])
  })

  test('Components are removed from an entity.', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B(), new C()])
    world.remove(entity, [A, B])
    const entityCell = world.getEntity(entity)
    const components = [...entityCell.components()]

    deepStrictEqual(components,[typeid(C),typeid(Entity)])
  })

  test('Set and get correct resource on world.', () => {
    const world = new World()
    world.setResource(new TestResource())
    const resource = world.getResource(TestResource)

    deepStrictEqual(resource,new TestResource())
  })

  test('Set and get correct resource on world by `TypeId`.', () => {
    const world = new World()
    world.setResourceByTypeId(typeid(TestResource),new TestResource())
    const resource = world.getResourceByTypeId(typeid(TestResource))

    deepStrictEqual(resource,new TestResource())
  })

  test('Resource aliases point to correct resource.', () => {
    const world = new World()
    world.setResource(new TestResource())
    world.setResourceAlias(typeid(TestResource),TestAlias)
    const resource = world.getResource(TestAlias)

    deepStrictEqual(resource,new TestResource())
  })
})
