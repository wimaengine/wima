import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { Session, Storage, Cookies } from './resources'
import { registerStorageTypes } from './systems'

export class StoragePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Session())
      .setResource(new Storage())
      .setResource(new Cookies())
      .registerSystem({ schedule: AppSchedule.Startup, system: registerStorageTypes })
  }
}
