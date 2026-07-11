/** @import { ComponentHook } from '@wimaengine/ecs' */
import { SceneInstance } from '../components'
import { SceneSpawner } from '../resources'

/**
 * @type {ComponentHook}
 */
export function initSceneInstance(entity, world) {
  const spawner = world.getResource(SceneSpawner)
  const sceneHandle = world.get(entity, SceneInstance)

  // the scene may actually not be loaded so we will defer the actual spawning of the scene entities to when the scene asset is actually loaded.
  spawner.add(sceneHandle.handle.id(), entity)
}

/**
 * @type {ComponentHook}
 */
export function dropSceneInstance(entity, world) {
  const spawner = world.getResource(SceneSpawner)
  const sceneInstance = world.get(entity, SceneInstance)

  if (!sceneInstance) {
    return
  }

  spawner.remove(sceneInstance.handle.id(), entity)
  sceneInstance.handle.drop()
}
