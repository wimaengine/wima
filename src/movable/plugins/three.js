import {
  Velocity3D,
  Rotation3D,
  Acceleration3D,
  Torque3D
} from '../components/index.js'
import { App, Plugin } from '../../app/index.js'

export class Movable3DPlugin extends Plugin{

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Velocity3D)
      .registerType(Rotation3D)
      .registerType(Acceleration3D)
      .registerType(Torque3D)
  }
}