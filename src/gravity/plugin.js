import { App, AppSchedule } from '../app/index.js'
import { Vector2 } from '../math/index.js'
import { Gravity2D } from './resources/index.js'
import { applyGravity2D } from './systems/index.js'

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

/**
 * @typedef Gravity2DPluginOptions
 * @property {Vector2} [gravity]
 */