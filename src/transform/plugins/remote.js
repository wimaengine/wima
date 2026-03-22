import { Plugin, App } from '../../app/index.js'
import { registerRemoteTransform2DTypes, registerRemoteTransform3DTypes, transformRemote2D, transformRemote3D } from '../systems/index.js'
import { RemoteTransform3D, RemoteTransform2D } from '../components/index.js'
import { AppSchedule } from '../../core/index.js'

export class RemoteTransform2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(RemoteTransform2D)
      .registerSystem(AppSchedule.Startup, registerRemoteTransform2DTypes)
      .registerSystem(AppSchedule.Update, transformRemote2D)
  }
}

export class RemoteTransform3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(RemoteTransform3D)
      .registerSystem(AppSchedule.Startup, registerRemoteTransform3DTypes)
      .registerSystem(AppSchedule.Update, transformRemote3D)
  }
}
