import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { ComponentHooks } from '../ecs/index.js'
import { Window } from '../window/index.js'
import { closeWindow, openWindow } from './hooks/index.js'

export class DOMWindowPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setComponentHooks(Window, new ComponentHooks(openWindow, closeWindow))
  }
}
