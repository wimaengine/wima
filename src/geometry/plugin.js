import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { registerGeometryTypes } from './systems/index.js'

export class GeometryPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem(AppSchedule.Startup, registerGeometryTypes)
  }
}
