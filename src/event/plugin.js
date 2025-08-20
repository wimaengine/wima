/** @import { Constructor } from '../reflect/index.js'*/

import { App, AppSchedule, Plugin, SystemConfig } from '../app/index.js'
import { makeEventClear } from './systems/index.js'
import { Events } from './core/index.js'
import { typeidGeneric } from '../reflect/index.js'

/**
 * @template T
 */
export class EventPlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  event

  /**
   * @readonly
   * @type {boolean}
   */
  autoClearEvent

  /**
   * @param {EventPluginOptions<T>} options
   */
  constructor(options) {
    super()
    const { event, autoClearEvent = true } = options

    this.event = event
    this.autoClearEvent = autoClearEvent
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { event } = this
    const name = typeidGeneric(Events, [event])
    
    app
      .registerType(event)
      .getWorld()
      .setResourceByTypeId(name, new Events())
    
    // TODO - Once system ordering is implemented,remove this
    // and `App.systemsevents`.
    if (this.autoClearEvent) {
      app.systemsevents.push(new SystemConfig(makeEventClear(name), AppSchedule.Update))
    }
  }

  name(){
    return typeidGeneric(EventPlugin, [this.event])
  }
}

/**
 * @template T
 * @typedef EventPluginOptions
 * @property {Constructor<T>} event
 * @property {boolean} [autoClearEvent]
 */