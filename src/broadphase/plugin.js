/** @import {Broadphasable2D} from './resources/index.js'*/
import { App, AppSchedule, Plugin } from '../app/index.js'
import { PhysicsHitbox } from './components/index.js'
import { CollisionPairs, Broadphase2D } from './resources/index.js'
import { getCollisionPairs, updateBroadphase2D } from './systems/index.js'

export class Broadphase2DPlugin extends Plugin {

  /**
   * @readonly
   * @type {Broadphasable2D}
   */
  innerBroadphase

  /**
   * @param {Broadphase2DPluginOptions} options 
   */
  constructor({ broadphase }){
    super()
    this.innerBroadphase = broadphase
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(PhysicsHitbox)
      .setResource(new Broadphase2D(this.innerBroadphase))
      .setResource(new CollisionPairs())
      .registerSystem(AppSchedule.Update, getCollisionPairs)
      .registerSystem(AppSchedule.Update, updateBroadphase2D)
  }
}

/**
 * @typedef Broadphase2DPluginOptions
 * @property {Broadphasable2D} broadphase
 */