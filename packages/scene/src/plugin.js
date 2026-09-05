import { App, Plugin } from '@wimaengine/app'
import { AssetExporterPlugin, AssetImporterPlugin, AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { HierarchyPlugin } from '@wimaengine/hierarchy'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { Scene } from './assets'
import { SceneInstance } from './components'
import { SceneAdded, SceneDropped, SceneModified } from './events'
import { initSceneInstance, dropSceneInstance } from './hooks'
import { JSONSceneExporter, JSONSceneImporter, SceneAssets, SceneSpawner } from './resources'
import { registerSceneTypes, spawnScenes } from './systems'

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
      .setResource(new SceneSpawner())
      .setComponentHooks(SceneInstance, new ComponentHooks(
        initSceneInstance,
        dropSceneInstance
      ))
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerSceneTypes })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: spawnScenes })
      .setResourceAlias(typeidGeneric(Assets, [Scene]), SceneAssets)
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(HierarchyPlugin)]
  }
}
