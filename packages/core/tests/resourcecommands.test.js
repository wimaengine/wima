import { strictEqual } from 'node:assert'
import { describe, test } from 'vitest'
import { CommandQueue } from '@wimaengine/command'
import { World } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { ResourceCommands } from '../src/index.js'
import { executeCommands } from '../src/systems/index.js'

class TestResource { }
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
})
