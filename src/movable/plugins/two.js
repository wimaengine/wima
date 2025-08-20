import {
  Velocity2D,
  Rotation2D,
  Acceleration2D,
  Torque2D
} from '../components/index.js'
import { App, Plugin } from '../../app/index.js'

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
  }
}