/** @import { Constructor } from '@wimaengine/type'*/

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { makeEventClear, registerEventTypes } from './systems'
import { Events } from './core'
import { typeid, typeidGeneric } from '@wimaengine/type'

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
        systemGroup: CoreSystems.Start,
        system: registerEventTypes(event)
      })
      .getWorld()
      .setResourceByTypeId(name, new Events())

    if (this.autoClearEvent) {
      app
        .registerSystem({
          label: `clearEvents<${typeid(event)}>`,
          schedule: AppSchedule.Update,
          systemGroup: CoreSystems.End,
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
