import { Broadphase2DPlugin, NaiveBroadphase2D } from '@wimaengine/broadphase'
import { App, Plugin } from '@wimaengine/app'
import { ComponentHooks } from '@wimaengine/ecs'
import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
import { EulerIntegrator2DPlugin } from '@wimaengine/integrator'
import { Collider2D, PhysicsProperties, SoftBody2D, SoftBody3D } from '../components'
import { physicspropertiesAddHook } from '../hooks'
import { collisionResponse, registerPhysicsTypes, updateBodies, updateBounds } from '../systems'
import { AppSchedule } from '@wimaengine/core'

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
      .registerType(Collider2D)
      .registerType(PhysicsProperties)
      .registerType(SoftBody2D)
      .registerType(SoftBody3D)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerPhysicsTypes })
      .setComponentHooks(
        PhysicsProperties,
        new ComponentHooks(
          physicspropertiesAddHook,
          null,
          physicspropertiesAddHook
        )
      )
    app.registerSystem({ schedule: AppSchedule.Update, system: updateBodies })

    if (this.autoUpdateBounds) app.registerSystem({ schedule: AppSchedule.Update, system: updateBounds })

    app
      .registerPlugin(this.broadphase)
      .registerPlugin(this.narrowphase)
      .registerSystem({ schedule: AppSchedule.Update, system: collisionResponse })
  }
}

/**
 * @typedef Physics2DPluginOptions
 * @property {Plugin} [broadphase]
 * @property {Plugin} [narrowphase]
 * @property {Plugin} [integrator]
 * @property {boolean} [autoUpdateBounds]
 */
