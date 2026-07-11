import { App, Plugin } from '@wimaengine/app'
import { CommandQueue } from './resources'

export class CommandsPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new CommandQueue())
  }
}
