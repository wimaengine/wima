import { strictEqual } from 'node:assert'
import { describe, test } from 'vitest'
import { Command, CommandQueue, executeCommands } from '@wimaengine/command'
import { World } from '@wimaengine/ecs'

class TestCommand extends Command {
  /**
   * @param {World} world
   */
  execute(world) {
    world.setResource(new TestResource())
  }
}

class TestResource { }

describe('Testing `executeCommands`', () => {
  test('drains and executes queued commands', () => {
    const world = new World()
    const queue = new CommandQueue()
    const command = new TestCommand()

    queue.add(command)
    world.setResource(queue)

    executeCommands(world)

    strictEqual(world.hasResource(TestResource), true)
    strictEqual(queue.size(), 0)
  })
})
