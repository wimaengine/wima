import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { Name } from './components'
import { registerNameTypes } from './systems'

export class NamePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Name)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerNameTypes })
  }
}
