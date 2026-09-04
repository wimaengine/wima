import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Movable2DPlugin } from '@wimaengine/movable'
import { Transform2DPlugin } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
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

  requires() {
    return [typeid(CorePlugin), typeid(Movable2DPlugin), typeid(Transform2DPlugin)]
  }
}
