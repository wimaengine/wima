import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { TypeRegistry } from './resources'
import { registerReflectTypes } from './systems'

export class ReflectPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const typeregistry = new TypeRegistry()

    app
      .setResource(typeregistry)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerReflectTypes })
  }
}
