import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { Name } from './components/index.js'
import { registerNameTypes } from './systems/index.js'

export class NamePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Name)
      .registerSystem(AppSchedule.Startup, registerNameTypes)
  }
}
