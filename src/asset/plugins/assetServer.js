import { App, Plugin } from '../../app/index.js'
import { EventPlugin } from '../../event/index.js'
import { AssetServer } from '../resources/index.js'
import { AssetLoadFail, AssetLoadSuccess } from '../events/index.js'
import { updateAssets, updateAssetLoadEvents, logFailedLoads, registerAssetServerTypes } from '../systems/index.js'
import { AppSchedule } from '../../core/index.js'

export class AssetServerPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new AssetServer())
      .registerPlugin(new EventPlugin({
        event: AssetLoadSuccess
      }))
      .registerPlugin(new EventPlugin({
        event: AssetLoadFail
      }))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerAssetServerTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: updateAssets })
      .registerSystem({ schedule: AppSchedule.Update, system: updateAssetLoadEvents })
      .registerSystem({ schedule: AppSchedule.Update, system: logFailedLoads })
  }
}
