import { strictEqual } from 'node:assert'
import { describe, test } from 'vitest'
import { CommandQueue, executeCommands } from '@wimaengine/command'
import { World } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { ResourceCommands } from '../src/index.js'

class TestResource {
  constructor() {
    this.display = { enabled: false }
    this.values = new Map([['enabled', false]])
    this.map = new Map([['display', { enabled: false }]])
    this.array = [false, false]
    this.items = [{ display: { enabled: false } }]
  }
}

class TestAlias extends TestResource { }

describe('Testing `ResourceCommands`', () => {
  test('`add()` adds a resource when commands execute', () => {
    const world = new World()
    const resource = new TestResource()

    world.setResource(new CommandQueue())
    const commands = new ResourceCommands(world)

    commands.add(resource)
    executeCommands(world)

    strictEqual(world.getResource(TestResource), resource)
  })

  test('`remove()` removes a resource when commands execute', () => {
    const world = new World()

    world.setResource(new CommandQueue())
    world.setResource(new TestResource())
    const commands = new ResourceCommands(world)

    commands.remove(TestResource)
    executeCommands(world)

    strictEqual(world.hasResource(TestResource), false)
  })

  test('`setAlias()` resolves a resource through an alias when commands execute', () => {
    const world = new World()
    const resource = new TestResource()
    const id = typeid(TestResource)

    world.setResource(resource)
    world.setResource(new CommandQueue())
    const commands = new ResourceCommands(world)

    commands.setAlias(id, TestAlias)
    executeCommands(world)

    strictEqual(world.getResource(TestAlias), resource)
  })

  test('`set()` replaces a resource when the path is empty', () => {
    const world = new World()
    const previous = new TestResource()
    const next = new TestResource()

    world.setResource(previous)
    world.setResource(new CommandQueue())
    new ResourceCommands(world).set(TestResource, next)
    executeCommands(world)

    strictEqual(world.getResource(TestResource), next)
  })

  test('`set()` updates a nested resource value by JSON Pointer path', () => {
    const world = new World()
    const resource = new TestResource()

    world.setResource(resource)
    world.setResource(new CommandQueue())
    new ResourceCommands(world).set(TestResource, true, ['display', 'enabled'])
    executeCommands(world)

    strictEqual(world.getResource(TestResource).display.enabled, true)
  })

  test('`set()` updates a shallow resource value by one-level path', () => {
    const world = new World()
    const resource = new TestResource()

    world.setResource(resource)
    world.setResource(new CommandQueue())
    new ResourceCommands(world).set(TestResource, { enabled: true }, ['display'])
    executeCommands(world)

    strictEqual(world.getResource(TestResource).display.enabled, true)
  })

  test('`set()` updates a resource value inside a Map', () => {
    const world = new World()
    const resource = new TestResource()

    world.setResource(resource)
    world.setResource(new CommandQueue())
    new ResourceCommands(world).set(TestResource, true, [
      'values',
      'enabled',
    ])
    executeCommands(world)

    strictEqual(world.getResource(TestResource).values.get('enabled'), true)
  })

  test('`set()` updates a nested resource value inside a Map', () => {
    const world = new World()
    const resource = new TestResource()

    world.setResource(resource)
    world.setResource(new CommandQueue())
    new ResourceCommands(world).set(TestResource, true, [
      'map',
      'display',
      'enabled',
    ])
    executeCommands(world)

    strictEqual(world.getResource(TestResource).map.get('display').enabled, true)
  })

  test('`set()` updates a resource value by array index', () => {
    const world = new World()
    const resource = new TestResource()

    world.setResource(resource)
    world.setResource(new CommandQueue())
    new ResourceCommands(world).set(TestResource, true, [
      'array',
      1,
    ])
    executeCommands(world)

    strictEqual(world.getResource(TestResource).array[1], true)
  })

  test('`set()` updates a nested resource value inside an array', () => {
    const world = new World()
    const resource = new TestResource()

    world.setResource(resource)
    world.setResource(new CommandQueue())
    new ResourceCommands(world).set(TestResource, true, [
      'items',
      0,
      'display',
      'enabled',
    ])
    executeCommands(world)

    strictEqual(world.getResource(TestResource).items[0].display.enabled, true)
  })
})
