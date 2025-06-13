import { App, AppSchedule, Plugin } from '../app/index.js'
import { Linear2DDamping, Angular2DDamping, Linear3DDamping, Angular3DDamping } from './resources/index.js'
import { dampenRotation2D, dampenRotation3D, dampenVelocity2D, dampenVelocity3D } from './systems/index.js'

export class Damping2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Linear2DDamping(0.99))
      .setResource(new Angular2DDamping(0.99))
      .registerSystem(AppSchedule.Update, dampenVelocity2D)
      .registerSystem(AppSchedule.Update, dampenRotation2D)
  }
}

export class Damping3DPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Linear3DDamping(0.9))
      .setResource(new Angular3DDamping(0.9))
      .registerSystem(AppSchedule.Update, dampenVelocity3D)
      .registerSystem(AppSchedule.Update, dampenRotation3D)
  }
}