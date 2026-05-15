import { App, Plugin } from '../app/index.js'
import { despawnParticles, emitParticles2D, emitParticles3D } from './systems/index.js'
import { Particle, Emitter } from './components/index.js'
import { AppSchedule } from '../core/index.js'

export class Emitter2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Particle)
      .registerType(Emitter)
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
      .registerType(Particle)
      .registerType(Emitter)
      .registerSystem({ schedule: AppSchedule.Update, system: despawnParticles })
      .registerSystem({ schedule: AppSchedule.Update, system: emitParticles3D })

  }
}
