import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { World } from '../ecs/index.js'
import { CommandQueue } from './resources/index.js'

export class CommandsPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new CommandQueue())
      .registerSystem(AppSchedule.Update, executeCommands)
  }
}

/**
 * @param {World} world
 */
function executeCommands(world) {
  const commands = world.getResource(CommandQueue).drain()

  for (const command of commands) {
    command.execute(world)
  }
}
