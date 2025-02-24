import { App, Plugin } from '../app/index.js'
import { KeyboardPlugin } from '../keyboard/index.js'
import { MousePlugin } from '../mouse/index.js'
import { TouchPlugin } from '../touch/index.js'

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