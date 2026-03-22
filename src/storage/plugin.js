import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { Session, Storage, Cookies } from './resources/index.js'
import { registerStorageTypes } from './systems/index.js'

export class StoragePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Session())
      .setResource(new Storage())
      .setResource(new Cookies())
      .registerSystem(AppSchedule.Startup, registerStorageTypes)
  }
}
