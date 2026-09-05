import { App, Plugin } from '@wimaengine/app'
import { Broadphase2DPlugin, NaiveBroadphase2D } from '@wimaengine/broadphase'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { EulerIntegrator2DPlugin } from '@wimaengine/integrator'
import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
import { Transform2DPlugin } from '@wimaengine/transform'
import { typeid } from '@wimaengine/type'
import { collisionResponse, updateBodies, updateBounds } from '../systems'

// TODO: Convert to a plugin group
export class Physics2DPlugin extends Plugin {

  /**
   * @param {Physics2DPluginOptions} options
   */
  constructor({
    autoUpdateBounds = true,
    broadphase = new Broadphase2DPlugin({
      broadphase: new NaiveBroadphase2D()
    }),
    narrowphase = new NarrowPhase2DPlugin(),
    integrator = new EulerIntegrator2DPlugin()
  } = {}) {
    super()
    this.broadphase = broadphase
    this.narrowphase = narrowphase

    // TODO: Remove this, legacy option
    this.integrator = integrator
    this.autoUpdateBounds = autoUpdateBounds
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
    app.registerSystem({ schedule: AppSchedule.Update, system: updateBodies })

    if (this.autoUpdateBounds) app.registerSystem({ schedule: AppSchedule.Update, system: updateBounds })

    app
      .registerPlugin(this.broadphase)
      .registerPlugin(this.narrowphase)
      .registerSystem({ schedule: AppSchedule.Update, system: collisionResponse })
  }

  requires() {
    return [typeid(CorePlugin), typeid(Transform2DPlugin)]
  }
}

/**
 * @typedef Physics2DPluginOptions
 * @property {Plugin} [broadphase]
 * @property {Plugin} [narrowphase]
 * @property {Plugin} [integrator]
 * @property {boolean} [autoUpdateBounds]
 */
