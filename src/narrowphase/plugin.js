import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { Contacts, SATNarrowphase2D } from './resources/index.js'
import { getSATContacts, registerNarrowphase2DTypes } from './systems/index.js'

/**
 * Uses the Separation Axis Theorem.
 * Best when your body shapes have few vertices.
 */
export class NarrowPhase2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Contacts())
      .setResource(new SATNarrowphase2D())
      .registerSystem(AppSchedule.Startup, registerNarrowphase2DTypes)
      .registerSystem(AppSchedule.Update, getSATContacts)
  }
}
