import { App, AppSchedule, Plugin } from '../app/index.js'
import { ComponentHooks } from '../ecs/index.js'
import { Window } from '../window/index.js'
import { closeWindow, openWindow } from './hooks/index.js'
import { executeWindowCommands } from './systems/index.js'

export class DOMWindowPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setComponentHooks(Window, new ComponentHooks(openWindow, closeWindow))
      .registerSystem(AppSchedule.Update, executeWindowCommands)
  }
}