import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { despawnParticles, emitParticles2D, emitParticles3D } from './systems'

export class Emitter2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: despawnParticles })
      .registerSystem({ schedule: AppSchedule.Update, system: emitParticles2D })

  }
}

export class Emitter3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: despawnParticles })
      .registerSystem({ schedule: AppSchedule.Update, system: emitParticles3D })

  }
}
