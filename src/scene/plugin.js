import { App, Plugin } from '../app/index.js'
import { ComponentHooks } from '../ecs/index.js'
import { Scene } from './assets/index.js'
import { SceneInstance } from './components/index.js'
import { SceneAssets, SceneSpawner } from './resources/index.js'
import { initSceneInstance } from './hooks/index.js'
import { AssetPlugin, Assets } from '../asset/index.js'
import { SceneAdded, SceneDropped, SceneModified } from './events/index.js'
import { typeidGeneric } from '../type/index.js'
import { spawnScenes } from './systems/index.js'
import { AppSchedule } from '../core/index.js'

export class ScenePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerPlugin(new AssetPlugin({
        asset:Scene,
        events:{
          added:SceneAdded,
          modified:SceneModified,
          dropped:SceneDropped
        }
      }))
      .registerType(SceneInstance)
      .setResource(new SceneSpawner())
      .setComponentHooks(SceneInstance, new ComponentHooks(
        initSceneInstance
      ))
      .registerSystem(AppSchedule.Update, spawnScenes)

    const world = app.getWorld()

    world.setResourceAlias(typeidGeneric(Assets, [Scene]), SceneAssets)
  }
}
