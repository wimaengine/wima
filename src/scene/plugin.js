import { ComponentHooks } from '../ecs/index.js';
import { Scene } from './assets/index.js'
import { SceneInstance } from './components/index.js'
import { SceneSpawner, SceneComponentMapper } from './resources/index.js'
import { initSceneInstance,removeSceneInstance } from './hooks/index.js';

export class ScenePlugin {
  register(app) {
    app
      .registerAsset(Scene)
      .registerType(SceneInstance)
      .setResource(new SceneSpawner())
      .registerComponentHooks(SceneInstance, new ComponentHooks(initSceneInstance, null,removeSceneInstance))
  }
}