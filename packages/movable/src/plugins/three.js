import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import {
  Velocity3D,
  Rotation3D,
  Acceleration3D,
  Torque3D
} from '../components'
import { registerMovable3DTypes } from '../systems'

export class Movable3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Velocity3D)
      .registerType(Rotation3D)
      .registerType(Acceleration3D)
      .registerType(Torque3D)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerMovable3DTypes })
  }
}
