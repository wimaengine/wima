import { ComponentHooks } from '../ecs/index.js';
import { Scene } from './assets/index.js'
import { SceneHandle, SceneInstance } from './components/index.js'
import { SceneSpawner, SceneComponentMapper } from './resources/index.js'
import {remove} from './hooks/index.js';

export class ScenePlugin {
  register(app) {
    app
      .registerAsset(Scene)
      .registerType(SceneHandle)
      .registerType(SceneInstance)
      .setResource(new SceneSpawner())
      .setResource(new SceneComponentMapper())
      .registerComponentHooks(SceneHandle, new ComponentHooks(initSceneInstance,removeSceneInstance))
  }
}