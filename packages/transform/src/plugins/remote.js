import { Plugin, App } from '@wimaengine/app'
import { registerRemoteTransform2DTypes, registerRemoteTransform3DTypes, transformRemote2D, transformRemote3D } from '../systems'
import { RemoteTransform3D, RemoteTransform2D } from '../components'
import { AppSchedule } from '@wimaengine/core'

export class RemoteTransform2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(RemoteTransform2D)
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
      .registerType(RemoteTransform3D)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerRemoteTransform3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: transformRemote3D })
  }
}
