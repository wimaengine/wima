import { strictEqual } from 'node:assert'
import { describe, test } from 'vitest'
import { CommandQueue, executeCommands } from '@wimaengine/command'
import { EntityCommands } from '../src/index.js'
import { World } from '@wimaengine/ecs'

class TestComponent {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
    this.transform = {
      position: { x: 1, y: 2 },
      scale: { x: 3, y: 4 },
    }
    this.values = new Map([['x', 1]])
    this.map = new Map([['transform', { position: { x: 1 } }]])
    this.array = [1, 2]
    this.items = [{ position: { x: 3 } }]
  }
}

describe('Testing `EntityCommands.set()`', () => {
  test('replaces a component when the path is empty', () => {
    const world = new World()
    const entity = world.spawn([new TestComponent(1, 2)])
    const next = new TestComponent(3, 4)

    world.setResource(new CommandQueue())
    new EntityCommands(world).entity(entity).set(TestComponent, next)
    executeCommands(world)

    strictEqual(world.get(entity, TestComponent), next)
  })

  test('updates a nested component value by JSON Pointer path', () => {
    const world = new World()
    const entity = world.spawn([new TestComponent(1, 2)])

    world.setResource(new CommandQueue())
    new EntityCommands(world).entity(entity).set(TestComponent, 9, ['x'])
    executeCommands(world)

    strictEqual(world.get(entity, TestComponent).x, 9)
    strictEqual(world.get(entity, TestComponent).y, 2)
  })

  test('updates a deeply nested component value without changing sibling values', () => {
    const world = new World()
    const entity = world.spawn([new TestComponent()])

    world.setResource(new CommandQueue())
    new EntityCommands(world).entity(entity).set(TestComponent, 10, [
      'transform',
      'position',
      'x',
    ])
    executeCommands(world)

    const position = world.get(entity, TestComponent)
    strictEqual(position.transform.position.x, 10)
    strictEqual(position.transform.position.y, 2)
    strictEqual(position.transform.scale.x, 3)
    strictEqual(position.transform.scale.y, 4)
  })

  test('updates a component value inside a Map', () => {
    const world = new World()
    const entity = world.spawn([new TestComponent()])

    world.setResource(new CommandQueue())
    new EntityCommands(world).entity(entity).set(TestComponent, 9, [
      'values',
      'x',
    ])
    executeCommands(world)

    strictEqual(world.get(entity, TestComponent).values.get('x'), 9)
  })

  test('updates a nested component value inside a Map', () => {
    const world = new World()
    const entity = world.spawn([new TestComponent()])

    world.setResource(new CommandQueue())
    new EntityCommands(world).entity(entity).set(TestComponent, 9, [
      'map',
      'transform',
      'position',
      'x',
    ])
    executeCommands(world)

    strictEqual(world.get(entity, TestComponent).map.get('transform').position.x, 9)
  })

  test('updates a component value by array index', () => {
    const world = new World()
    const entity = world.spawn([new TestComponent()])

    world.setResource(new CommandQueue())
    new EntityCommands(world).entity(entity).set(TestComponent, 9, [
      'array',
      1,
    ])
    executeCommands(world)

    strictEqual(world.get(entity, TestComponent).array[1], 9)
  })

  test('updates a nested component value inside an array', () => {
    const world = new World()
    const entity = world.spawn([new TestComponent()])

    world.setResource(new CommandQueue())
    new EntityCommands(world).entity(entity).set(TestComponent, 9, [
      'items',
      0,
      'position',
      'x',
    ])
    executeCommands(world)

    strictEqual(world.get(entity, TestComponent).items[0].position.x, 9)
  })
})
