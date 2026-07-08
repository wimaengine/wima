import { App, Plugin } from '@wimaengine/app'
import { ComponentHooks } from '@wimaengine/ecs'
import { Scene } from './assets'
import { SceneInstance } from './components'
import { JSONSceneExporter, JSONSceneImporter, SceneAssets, SceneSpawner } from './resources'
import { initSceneInstance, dropSceneInstance } from './hooks'
import { AssetExporterPlugin, AssetImporterPlugin, AssetPlugin, Assets } from '@wimaengine/asset'
import { SceneAdded, SceneDropped, SceneModified } from './events'
import { typeidGeneric } from '@wimaengine/type'
import { registerSceneTypes, spawnScenes } from './systems'
import { AppSchedule, CoreSystems } from '@wimaengine/core'

export class ScenePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerPlugin(new AssetImporterPlugin({
        asset: Scene,
        importer: new JSONSceneImporter()
      }))
      .registerPlugin(new AssetExporterPlugin({
        asset: Scene,
        exporter: new JSONSceneExporter()
      }))
      .registerPlugin(new AssetPlugin({
        asset: Scene,
        events: {
          added: SceneAdded,
          modified: SceneModified,
          dropped: SceneDropped
        }
      }))
      .registerType(SceneInstance)
      .setResource(new SceneSpawner())
      .setComponentHooks(SceneInstance, new ComponentHooks(
        initSceneInstance,
        dropSceneInstance
      ))
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerSceneTypes })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: spawnScenes })

    const world = app.getWorld()

    world.setResourceAlias(typeidGeneric(Assets, [Scene]), SceneAssets)
  }
}
