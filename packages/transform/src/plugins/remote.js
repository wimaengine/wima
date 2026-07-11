import { Plugin, App } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { registerRemoteTransform2DTypes, registerRemoteTransform3DTypes, transformRemote2D, transformRemote3D } from '../systems'

export class RemoteTransform2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerRemoteTransform2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: transformRemote2D })
  }
}

export class RemoteTransform3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerRemoteTransform3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: transformRemote3D })
  }
}
