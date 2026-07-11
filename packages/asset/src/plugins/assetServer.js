import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { EventPlugin } from '@wimaengine/event'
import { AssetLoadFail, AssetLoadSuccess, AssetSaveSuccess } from '../events'
import { AssetServer } from '../resources'
import { updateAssets, logFailedLoads, registerAssetServerTypes } from '../systems'

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
