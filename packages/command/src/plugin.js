/** @import { App } from '@wimaengine/app' */
import { Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule, CoreSystems } from '@wimaengine/core'
import { typeid } from '@wimaengine/type'
import { CommandQueue } from './resources'
import { executeCommands } from './systems'

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

  requires() {
    return [typeid(CorePlugin)]
  }
}
