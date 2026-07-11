import { App, Plugin } from '@wimaengine/app'
import { KeyboardPlugin } from '@wimaengine/keyboard'
import { MousePlugin } from '@wimaengine/mouse'
import { TouchPlugin } from '@wimaengine/touch'

export class InputPlugin extends Plugin {

  /**
   * @type {HTMLElement}
   */
  target

  /**
   * @param {HTMLElement} target
   */
  constructor(target = document.body) {
    super()
    this.target = target
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerPlugin(new TouchPlugin())
      .registerPlugin(new MousePlugin())
      .registerPlugin(new KeyboardPlugin())
  }
}
