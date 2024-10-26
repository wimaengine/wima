import { App, AppSchedule } from '../../app/index.js'
import {
  updateAngularEuler2D,
  updateOrientationEuler2D,
  updatePositionEuler2D,
  updateVelocityEuler2D,
  updateAngularEuler3D,
  updateOrientationEuler3D,
  updatePositionEuler3D,
  updateVelocityEuler3D
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

export class EulerIntegrator3DPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem(AppSchedule.Update, updatePositionEuler3D)
      .registerSystem(AppSchedule.Update, updateVelocityEuler3D)
      .registerSystem(AppSchedule.Update, updateOrientationEuler3D)
      .registerSystem(AppSchedule.Update, updateAngularEuler3D)
  }
}