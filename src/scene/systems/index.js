import { Entity, Query, World } from '../../ecs/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { SceneInstance } from '../components/index.js'
import { SceneAssets, SceneSpawner } from '../resources/index.js'

export * from './types.js'

/**
 * @param {World} world
 */
export function spawnScenes(world) {
  const scenes = world.getResource(SceneAssets)
  const instances = new Query(world, [SceneInstance])
  const spawner = world.getResource(SceneSpawner)
  const typeRegistry = world.getResource(TypeRegistry)

  for (const assetId of spawner.assets()) {
    const scene = scenes.getByAssetId(assetId)

    if (!scene) continue

    const list = spawner.get(assetId)

    for (let i = 0; i < list.length; i++) {
      const entity = Entity.from(list[i])
      const instance = instances.get(entity)

      if (!instance) continue

      scene.toWorld(world, instance[0], typeRegistry, entity)
    }

    spawner.clear(assetId)
  }
}
