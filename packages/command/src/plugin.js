import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { CommandQueue } from './resources'

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
