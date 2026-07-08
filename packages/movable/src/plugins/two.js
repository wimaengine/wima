import {
  Velocity2D,
  Rotation2D,
  Acceleration2D,
  Torque2D
} from '../components'
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { registerMovable2DTypes } from '../systems'

export class Movable2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Velocity2D)
      .registerType(Rotation2D)
      .registerType(Acceleration2D)
      .registerType(Torque2D)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerMovable2DTypes })
  }
}
