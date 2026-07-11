import { CommandQueue } from '@wimaengine/command'
import { World } from '@wimaengine/ecs'

/**
 * @param {World} world
 */
export function executeCommands(world) {
  const commands = world.getResource(CommandQueue).drain()

  for (const command of commands) {
    command.execute(world)
  }
}
