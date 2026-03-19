import { App, Plugin } from '../app/index.js'
import { AppSchedule, defaultRunner } from './core/index.js'

export class CorePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.setRunner(defaultRunner)
    app.createSchedule(
      { label: AppSchedule.Startup, repeat: false }
    )
    app.createSchedule(
      { label: AppSchedule.Update, repeat: true }
    )
  }
}
