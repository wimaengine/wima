import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import {
  updateAngularEuler2D,
  updateOrientationEuler2D,
  updatePositionEuler2D,
  updateVelocityEuler2D,
  updateAngularEuler3D,
  updateOrientationEuler3D,
  updatePositionEuler3D,
  updateVelocityEuler3D
} from '../systems'

export class EulerIntegrator2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: updatePositionEuler2D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateVelocityEuler2D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateOrientationEuler2D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateAngularEuler2D })
  }
}

export class EulerIntegrator3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: updatePositionEuler3D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateVelocityEuler3D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateOrientationEuler3D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateAngularEuler3D })
  }
}
