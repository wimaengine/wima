/** @import {Broadphasable2D} from './resources'*/
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { CollisionPairs, Broadphase2D } from './resources'
import { getCollisionPairs, registerBroadphaseTypes2D, updateBroadphase2D } from './systems'

export class Broadphase2DPlugin extends Plugin {

  /**
   * @readonly
   * @type {Broadphasable2D}
   */
  innerBroadphase

  /**
   * @param {Broadphase2DPluginOptions} options
   */
  constructor({ broadphase }) {
    super()
    this.innerBroadphase = broadphase
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerBroadphaseTypes2D })
      .setResource(new Broadphase2D(this.innerBroadphase))
      .setResource(new CollisionPairs())
      .registerSystem({ schedule: AppSchedule.Update, system: getCollisionPairs })
      .registerSystem({ schedule: AppSchedule.Update, system: updateBroadphase2D })
  }
}

/**
 * @typedef Broadphase2DPluginOptions
 * @property {Broadphasable2D} broadphase
 */
