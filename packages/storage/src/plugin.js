import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
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

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
