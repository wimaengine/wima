import { App, AppSchedule } from '../../app/index.js'
import { updatePositionVerlet2D, updateOrientationVerlet2D } from '../systems/index.js'

export class VerletIntegrator2DPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem(AppSchedule.Update, updatePositionVerlet2D)
      .registerSystem(AppSchedule.Update, updateOrientationVerlet2D)
  }
}