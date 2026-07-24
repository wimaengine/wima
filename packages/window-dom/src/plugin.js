import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { Window } from '@wimaengine/window'
import { closeWindow, openWindow } from './hooks'
import { resizeWindow } from './systems'

export class DOMWindowPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setComponentHooks(Window, new ComponentHooks(openWindow, closeWindow))
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.End,
        system: resizeWindow
      })
  }
}
