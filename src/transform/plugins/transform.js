import {
  Position2D,
  Orientation2D,
  Scale2D,
  GlobalTransform2D,
  Position3D,
  Orientation3D,
  Scale3D,
  GlobalTransform3D
} from '../components/index.js'
import { App, Plugin } from '../../app/index.js'
import { propagateTransform2D, propagateTransform3D, registerTransform2DTypes, registerTransform3DTypes, synctransform2D, synctransform3D } from '../systems/index.js'
import { AppSchedule } from '../../core/index.js'

export class Transform2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Position2D)
      .registerType(Orientation2D)
      .registerType(Scale2D)
      .registerType(GlobalTransform2D)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerTransform2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: synctransform2D })
      .registerSystem({ schedule: AppSchedule.Update, system: propagateTransform2D })
  }
}

export class Transform3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Position3D)
      .registerType(Orientation3D)
      .registerType(Scale3D)
      .registerType(GlobalTransform3D)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerTransform3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: synctransform3D })
      .registerSystem({ schedule: AppSchedule.Update, system: propagateTransform3D })
  }
}
