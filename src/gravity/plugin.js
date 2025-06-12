import { App, AppSchedule } from '../app/index.js'
import { Vector2, Vector3 } from '../math/index.js'
import { Gravity2D, Gravity3D } from './resources/index.js'
import { applyGravity2D, applyGravity3D } from './systems/index.js'

export class Gravity2DPlugin {

  /**
   * @readonly
   * @type {Vector2}
   */
  gravity

  /**
   * @param {Gravity2DPluginOptions} options 
   */
  constructor({ gravity = new Vector2(0, -980) } = {}) {
    this.gravity = gravity
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Gravity2D().copy(this.gravity))
      .registerSystem(AppSchedule.Update, applyGravity2D)
  }
}

export class Gravity3DPlugin {

  /**
   * @readonly
   * @type {Vector3}
   */
  gravity

  /**
   * @param {Gravity3DPluginOptions} options 
   */
  constructor({ gravity = new Vector3(0, -980, 0) } = {}) {
    this.gravity = gravity
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Gravity3D().copy(this.gravity))
      .registerSystem(AppSchedule.Update, applyGravity3D)
  }
}

/**
 * @typedef Gravity3DPluginOptions
 * @property {Vector3} [gravity]
 */

/**
 * @typedef Gravity2DPluginOptions
 * @property {Vector2} [gravity]
 */