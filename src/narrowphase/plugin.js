import { App, AppSchedule } from '../app/index.js'
import { Contacts, SATNarrowphase2D } from './resources/index.js'
import { getSATContacts } from './systems/index.js'

/**
 * Uses the Separation Axis Theorem.
 * Best when your body shapes have few vertices.
 */
export class NarrowPhase2DPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Contacts())
      .setResource(new SATNarrowphase2D())
      .registerSystem(AppSchedule.Update, getSATContacts)
  }
}