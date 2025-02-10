import { Gizmo3D, GizmoSettings } from '../core/index.js'
import { App, AppSchedule } from '../../app/index.js'
import {
  genenerateDrawGizmo3Dsystem
} from '../systems/index.js'

export class Gizmo3DPlugin {

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
      .setResourceByName(`gizmo3d<${this.name}>`, new Gizmo3D(this.settings))
    app
      .registerSystem(AppSchedule.Update, genenerateDrawGizmo3Dsystem(this.name))
  }
}