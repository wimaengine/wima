import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { updatePositionVerlet2D, updateOrientationVerlet2D } from '../systems'

export class VerletIntegrator2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: updatePositionVerlet2D })
      .registerSystem({ schedule: AppSchedule.Update, system: updateOrientationVerlet2D })
  }
}
