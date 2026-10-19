import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { TypeRegistry } from '@wimaengine/reflect'
import { SceneInstance } from '../components'
import { SceneAssets, SceneFilterAssets, SceneSpawner } from '../resources'

export * from './types'

/**
 * @param {World} world
 */
export function spawnScenes(world) {
  const scenes = world.getResource(SceneAssets)
  const instances = new Query(world, [SceneInstance])
  const spawner = world.getResource(SceneSpawner)
  const typeRegistry = world.getResource(TypeRegistry)
  const sceneFilters = world.getResource(SceneFilterAssets)

  for (const assetId of spawner.assets()) {
    const scene = scenes.getByAssetId(assetId)

    if (!scene) continue

    const list = spawner.get(assetId)

    for (let i = 0; i < list.length; i++) {
      const entity = EntityHandle.from(list[i])
      const instance = instances.get(entity)

      if (!instance) continue

      const filter = instance[0].filter ?
        sceneFilters.get(instance[0].filter) :
        undefined

      scene.toWorld(world, instance[0], typeRegistry, entity, filter)
    }

    spawner.clear(assetId)
  }
}
