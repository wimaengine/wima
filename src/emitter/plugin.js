import { App, AppSchedule, Plugin } from '../app/index.js'
import { despawnParticles, emitParticles2D, emitParticles3D } from './systems/index.js'
import { Particle, Emitter } from './components/index.js'

export class Emitter2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Particle)
      .registerType(Emitter)
      .registerSystem(AppSchedule.Update, despawnParticles)
      .registerSystem(AppSchedule.Update, emitParticles2D)

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
      .registerSystem(AppSchedule.Update, despawnParticles)
      .registerSystem(AppSchedule.Update, emitParticles3D)

  }
}