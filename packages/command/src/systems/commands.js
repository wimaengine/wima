/** @import { World } from '@wimaengine/ecs' */
import { CommandQueue } from '../resources'

/**
 * @param {World} world
 */
export function executeCommands(world) {
  const commands = world.getResource(CommandQueue).drain()

  for (const command of commands) {
    command.execute(world)
  }
}
