import { App, AppSchedule } from '../../app/index.js'
import {
  updateAngularEuler2D,
  updateOrientationEuler2D,
  updatePositionEuler2D,
  updateVelocityEuler2D
} from '../systems/index.js'

export class EulerIntegrator2DPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem(AppSchedule.Update, updatePositionEuler2D)
      .registerSystem(AppSchedule.Update, updateVelocityEuler2D)
      .registerSystem(AppSchedule.Update, updateOrientationEuler2D)
      .registerSystem(AppSchedule.Update, updateAngularEuler2D)
  }
}