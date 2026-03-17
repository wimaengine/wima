import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { World } from '../ecs/index.js'
import { EntityCommands } from './resources/index.js'

export class CommandsPlugin extends Plugin {

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
  const commands = registry.getResource(EntityCommands)

  commands.apply(registry)
  commands.clear()
}
