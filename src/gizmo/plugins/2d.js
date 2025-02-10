import { App, AppSchedule } from '../../app/index.js'
import { Gizmo2D, GizmoSettings } from '../core/index.js'
import {
  genenerateDrawGizmo2Dsystem
} from '../systems/index.js'

export class Gizmo2DPlugin {

  /**
   * @type {string}
   */
  name

  /**
   * @type {GizmoSettings}
   */
  settings
  constructor({
    name = 'default',
    settings = new GizmoSettings()
  } = {}) {
    this.name = name
    this.settings = settings
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .getWorld()
      .setResourceByName(`gizmo2d<${this.name}>`, new Gizmo2D(this.settings))
    app
      .registerSystem(AppSchedule.Update, genenerateDrawGizmo2Dsystem(this.name))
  }
}