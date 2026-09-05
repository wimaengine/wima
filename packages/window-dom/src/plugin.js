import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { Window, WindowPlugin } from '@wimaengine/window'
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

  requires() {
    return [typeid(CorePlugin), typeid(WindowPlugin)]
  }
}
