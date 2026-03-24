import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { TypeRegistry } from './resources/index.js'
import { registerReflectTypes } from './systems/index.js'

export class ReflectPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const typeregistry = new TypeRegistry()

    app
      .setResource(typeregistry)
      .registerSystem(AppSchedule.Startup, registerReflectTypes)
  }
}
