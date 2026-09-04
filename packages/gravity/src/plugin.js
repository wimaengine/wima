import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Vector2, Vector3, MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { Movable2DPlugin, Movable3DPlugin } from '@wimaengine/movable'
import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
import { typeid } from '@wimaengine/type'
import { Gravity2D, Gravity3D } from './resources'
import { applyGravity2D, applyGravity3D, registerGravity2DTypes, registerGravity3DTypes } from './systems'

export class Gravity2DPlugin extends Plugin {

  /**
   * @readonly
   * @type {Vector2}
   */
  gravity

  /**
   * @param {Gravity2DPluginOptions} options
   */
  constructor({ gravity = new Vector2(0, -980) } = {}) {
    super()
    this.gravity = gravity
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Gravity2D().copy(this.gravity))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerGravity2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: applyGravity2D })
  }

  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(MathPlugin),
      typeid(Movable2DPlugin),
      typeid(NarrowPhase2DPlugin)
    ]
  }
}

export class Gravity3DPlugin extends Plugin {

  /**
   * @readonly
   * @type {Vector3}
   */
  gravity

  /**
   * @param {Gravity3DPluginOptions} options
   */
  constructor({ gravity = new Vector3(0, -980, 0) } = {}) {
    super()
    this.gravity = gravity
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Gravity3D().copy(this.gravity))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerGravity3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: applyGravity3D })
  }

  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(MathPlugin),
      typeid(Movable3DPlugin),
      typeid(NarrowPhase2DPlugin)
    ]
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
