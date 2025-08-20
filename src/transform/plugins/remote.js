import { AppSchedule, Plugin, App } from '../../app/index.js'
import { transformRemote2D, transformRemote3D } from '../systems/index.js'
import { RemoteTransform3D, RemoteTransform2D } from '../components/index.js'

export class RemoteTransform2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(RemoteTransform2D)
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
      .registerSystem(AppSchedule.Update, transformRemote3D)
  }
}