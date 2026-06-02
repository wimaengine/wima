import { App, Plugin } from '../../app/index.js'
import { EventPlugin } from '../../event/index.js'
import { AssetServer } from '../resources/index.js'
import { AssetLoadFail, AssetLoadSuccess, AssetSaveSuccess } from '../events/index.js'
import { updateAssets, logFailedLoads, registerAssetServerTypes } from '../systems/index.js'
import { AppSchedule, CoreSystems } from '../../core/index.js'

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
        event: AssetSaveSuccess
      }))
      .registerPlugin(new EventPlugin({
        event: AssetLoadFail
      }))
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetServerTypes
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        system: updateAssets
      })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: logFailedLoads })
  }
}
