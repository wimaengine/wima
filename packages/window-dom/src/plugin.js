import { App, Plugin } from '@wimaengine/app'
import { ComponentHooks } from '@wimaengine/ecs'
import { Window } from '@wimaengine/window'
import { closeWindow, openWindow } from './hooks'

export class DOMWindowPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setComponentHooks(Window, new ComponentHooks(openWindow, closeWindow))
  }
}
