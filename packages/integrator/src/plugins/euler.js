import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Movable2DPlugin, Movable3DPlugin } from '@wimaengine/movable'
import { Transform2DPlugin, Transform3DPlugin } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
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

  requires() {
    return [typeid(CorePlugin), typeid(Movable2DPlugin), typeid(Transform2DPlugin)]
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

  requires() {
    return [typeid(CorePlugin), typeid(Movable3DPlugin), typeid(Transform3DPlugin)]
  }
}
