/** @import { Constructor } from '../reflect/index.js'*/

import { App, AppSchedule, SystemConfig } from '../app/index.js'
import { makeEventClear } from './systems/index.js'
import { Events } from './core/index.js'

export class EventPlugin {

  /**
   * @readonly
   * @type {Constructor}
   */
  event

  /**
   * @readonly
   * @type {boolean}
   */
  autoClearEvent

  /**
   * @param {{ event: Constructor; autoClearEvent?:boolean; }} options
   */
  constructor(options) {
    const { event } = options

    this.event = event
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { event } = this
    const name = `events<${event.name.toLowerCase()}>`
    
    app
      .registerType(event)
      .getWorld()
      .setResourceByName(name, new Events())
    
    // TODO - Once system ordering is implemented,remove this
    // and `App.systemsevents`.
    app.systemsevents.push(new SystemConfig(makeEventClear(name), AppSchedule.Update))
  }
}