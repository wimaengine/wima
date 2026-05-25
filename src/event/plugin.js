/** @import { Constructor } from '../type/index.js'*/

import { App, Plugin } from '../app/index.js'
import { makeEventClear, registerEventTypes } from './systems/index.js'
import { Events } from './core/index.js'
import { typeid, typeidGeneric } from '../type/index.js'
import { AppSchedule } from '../core/index.js'

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
      .registerSystem({
        label: `registerEventTypes<${typeid(event)}>`,
        schedule: AppSchedule.Startup,
        system: registerEventTypes(event)
      })
      .getWorld()
      .setResourceByTypeId(name, new Events())

    if (this.autoClearEvent) {
      app
        .registerSystemGroup({ label: event, schedule: AppSchedule.Update })
        .registerSystem({
          label: `clearEvents<${typeid(event)}>`,
          schedule: AppSchedule.Update,
          systemGroup: event,
          system: makeEventClear(name)
        })
    }
  }

  name() {
    return typeidGeneric(EventPlugin, [this.event])
  }
}

/**
 * @template T
 * @typedef EventPluginOptions
 * @property {Constructor<T>} event
 * @property {boolean} [autoClearEvent]
 */
