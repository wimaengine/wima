import { AppSchedule, Plugin, App } from '../../app/index.js'
import { transformRemote2D } from '../systems/index.js'
import { RemoteTransform2D } from '../components/index.js'

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