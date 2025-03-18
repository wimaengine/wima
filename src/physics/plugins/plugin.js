/** @import { ChaosPlugin } from '../../app/index.js' */
import { Broadphase2DPlugin, NaiveBroadphase2D } from '../../broadphase/index.js'
import { App, AppSchedule } from '../../app/index.js'
import { ComponentHooks } from '../../ecs/index.js'
import { NarrowPhase2DPlugin } from '../../narrowphase/index.js'
import { EulerIntegrator2DPlugin } from '../../integrator/index.js'
import { Collider2D, PhysicsProperties, SoftBody2D, SoftBody3D } from '../components/index.js'
import { physicspropertiesAddHook } from '../hooks/index.js'
import { Gravity2DPlugin } from '../../gravity/index.js'
import { collisionResponse, updateBodies, updateBounds } from '../systems/index.js'

export class Physics2DPlugin {

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
    this.broadphase = broadphase
    this.narrowphase = narrowphase
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
      .setComponentHooks(
        PhysicsProperties,
        new ComponentHooks(
          physicspropertiesAddHook,
          null,
          physicspropertiesAddHook
        )
      )
    app.registerSystem(AppSchedule.Update, updateBodies)

    if (this.autoUpdateBounds) app.registerSystem(AppSchedule.Update, updateBounds)

    app
      .registerPlugin(new Gravity2DPlugin())
      .registerPlugin(this.broadphase)
      .registerPlugin(this.narrowphase)
      .registerSystem(AppSchedule.Update, collisionResponse)
      .registerPlugin(this.integrator)
  }
}

/**
 * @typedef Physics2DPluginOptions
 * @property {ChaosPlugin} [broadphase]
 * @property {ChaosPlugin} [narrowphase]
 * @property {ChaosPlugin} [integrator]
 * @property {boolean} [autoUpdateBounds]
 */