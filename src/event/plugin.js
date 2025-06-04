import { App, AppSchedule, SystemConfig } from '../app/index.js'
import { makeEventClear } from './systems/index.js'
import { Events } from './core/index.js'

export class EventPlugin {

  /**
   * @readonly
   * @type {Function}
   */
  event

  /**
   * @param {{ event: Function; }} options
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