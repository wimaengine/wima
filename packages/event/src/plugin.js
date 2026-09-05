/** @import { Constructor } from '@wimaengine/type'*/

import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule, CoreSystems } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Events } from './core'
import { makeEventClear, registerEventTypes } from './systems'

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
      .registerSystem({
        label: `registerEventTypes<${typeid(event)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerEventTypes(event)
      })
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

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
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
