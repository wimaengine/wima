import { App, Plugin } from '../app/index.js'
import { AppSchedule, CoreSystems } from '../core/index.js'
import { World } from '../ecs/index.js'
import { CommandQueue } from './resources/index.js'

export class CommandsPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new CommandQueue())
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.End,
        system: executeCommands
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.End,
        system: executeCommands
      })
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
