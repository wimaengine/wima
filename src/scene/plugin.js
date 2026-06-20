import { App, Plugin } from '../app/index.js'
import { ComponentHooks } from '../ecs/index.js'
import { Scene } from './assets/index.js'
import { SceneInstance } from './components/index.js'
import { JSONSceneExporter, JSONSceneImporter, SceneAssets, SceneSpawner } from './resources/index.js'
import { initSceneInstance, dropSceneInstance } from './hooks/index.js'
import { AssetExporterPlugin, AssetImporterPlugin, AssetPlugin, Assets } from '../asset/index.js'
import { SceneAdded, SceneDropped, SceneModified } from './events/index.js'
import { typeidGeneric } from '../type/index.js'
import { registerSceneTypes, spawnScenes } from './systems/index.js'
import { AppSchedule, CoreSystems } from '../core/index.js'

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
