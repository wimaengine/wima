import { App } from '../app/index.js'
import { KeyboardPlugin } from '../keyboard/index.js'
import { MousePlugin } from '../mouse/index.js'
import { TouchPlugin } from '../touch/index.js'

export class InputPlugin {

  /**
   * @type {HTMLElement}
   */
  target

  /**
   * @param {HTMLElement} target
   */
  constructor(target = document.body) {
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