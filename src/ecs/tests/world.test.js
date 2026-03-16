import { test, describe } from "node:test";
import { deepStrictEqual, throws } from "node:assert";
import { World } from "../registry.js";
import { typeid } from "../../type/index.js";
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

class TestAlias extends TestResource { }

describe("Testing `World`", () => {
  test('Entity is spawned correctly into a world.', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B(), new C()])
    const entityCell = world.getEntity(entity)
    const components = [...entityCell.components()]

    deepStrictEqual(components, [typeid(A), typeid(B), typeid(C), typeid(Entity)])
  })

  test('Entity generation starts at one.', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B(), new C()])

    deepStrictEqual(entity,new Entity(0,1))
  })

  test('Entity generation is incremented.', () => {
    const world = new World()
    const entity1 = world.spawn([new A(), new B(), new C()])
    world.despawn(entity1)
    const entity2 = world.spawn([new A(), new B(), new C()])
    world.despawn(entity2)
    const entity3 = world.spawn([new A(), new B(), new C()])

    deepStrictEqual(entity1,new Entity(0,1))
    deepStrictEqual(entity2,new Entity(0,2))
    deepStrictEqual(entity3,new Entity(0,3))
  })

  test('Entity is despawned correctly from a world.', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B(), new C()])
    world.despawn(entity)
    const entityCell = world.getEntity(entity)
    const components = [...entityCell.components()]

    deepStrictEqual(components, [])
  })

  test('Invalidated entity cannot be accessed on same index', () => {
    const world = new World()
    const entity1 = world.spawn([new A()])
    world.despawn(entity1)
    const entity2 = world.spawn([new A()])

    const cell1 = world.getEntity(entity1)
    const cell2 = world.getEntity(entity2)
  
    deepStrictEqual(entity1,new Entity(0,1))
    deepStrictEqual(entity2,new Entity(0,2))
    deepStrictEqual(cell1.exists(), false)
    deepStrictEqual(cell2.exists(), true)
  })

  test('Components are inserted into an entity.', () => {
    const world = new World()
    const entity = world.spawn([])
    world.insert(entity, [new A(), new B(), new C()])
    const entityCell = world.getEntity(entity)
    const components = [...entityCell.components()]

    deepStrictEqual(components, [typeid(Entity), typeid(A), typeid(B), typeid(C)])
  })

  test('Components are removed from an entity.', () => {
    const world = new World()
    const entity = world.spawn([new A(), new B(), new C()])
    world.remove(entity, [A, B])
    const entityCell = world.getEntity(entity)
    const components = [...entityCell.components()]

    deepStrictEqual(components, [typeid(C), typeid(Entity)])
  })

  test('Set and get correct resource on world.', () => {
    const world = new World()
    world.setResource(new TestResource())
    const resource = world.getResource(TestResource)

    deepStrictEqual(resource, new TestResource())
  })

  test('Set and get correct resource on world by `TypeId`.', () => {
    const world = new World()
    world.setResourceByTypeId(typeid(TestResource), new TestResource())
    const resource = world.getResourceByTypeId(typeid(TestResource))

    deepStrictEqual(resource, new TestResource())
  })

  test('World has resource.', () => {
    const world = new World()
    world.setResource(new TestResource())

    deepStrictEqual(world.hasResource(TestResource), true)
    deepStrictEqual(world.hasResource(TestAlias), false)
  })

  test('World has resource by `TypeId`.', () => {
    const world = new World()
    world.setResource(new TestResource())

    deepStrictEqual(world.hasResourceByTypeId(typeid(TestResource)), true)
    deepStrictEqual(world.hasResourceByTypeId(typeid(TestAlias)), false)
  })

  test('Removing a resource on a world.', () => {
    const world = new World()
    world.setResource(new TestResource())
    world.removeResource(TestResource)

    throws(()=>world.getResource(TestResource))
  })

  test('Removing a resource on a world by `TypeId`.', () => {
    const world = new World()
    world.setResource(new TestResource())
    world.removeResourceByTypeId(typeid(TestResource))

    throws(()=>world.getResource(TestResource))
  })

  test('Resource aliases point to correct resource.', () => {
    const world = new World()
    world.setResource(new TestResource())
    world.setResourceAlias(typeid(TestResource), TestAlias)
    const resource = world.getResource(TestAlias)

    deepStrictEqual(resource, new TestResource())
  })
})
