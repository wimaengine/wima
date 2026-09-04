/** @import { App } from '@wimaengine/app' */
import { Plugin } from '@wimaengine/app'
import { CorePlugin } from '@wimaengine/core'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { CommandQueue } from './resources'
import { executeCommands } from './systems'
import { typeid } from '@wimaengine/type'

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
