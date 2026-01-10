/**@import { ComponentHook } from '../../ecs/index.js' */

import { EntityCommands } from '../../command/index.js'
import { SceneInstance } from '../components/instance.js'
import { SceneSpawner } from '../resources/index.js'

/**
 * @type {ComponentHook}
 */
export function initSceneInstance(entity,world) {
  const spawner = world.getResource(SceneSpawner)
  const sceneHandle = world.get(entity,SceneInstance)
  
  //the scene may actually not be loaded so we will defer the actual spawning of the scene entities to when the scene asset is actually loaded.
  spawner.add(sceneHandle.handle.id(),entity)
}