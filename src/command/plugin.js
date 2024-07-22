import { App } from '../app/app.js'
import { AppSchedule } from '../app/schedules.js'
import { World } from '../ecs/index.js'
import { EntityCommands } from './resources/index.js'

export class CommandsPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new EntityCommands(app.getWorld()))
      .registerSystem(AppSchedule.Update, executeCommands)
  }
}

/**
 * @param {World} registry
 */
function executeCommands(registry) {
  const commands = registry.getResource('entitycommands')

  commands.apply(registry)
  commands.clear()
}