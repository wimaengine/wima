import { Entity, Query, World } from "../../ecs/index.js"
import { SceneInstance } from "../components/index.js"
import { SceneAssets, SceneSpawner } from "../resources/index.js"

/**
 * @param {World} world
 */
export function spawnScenes(world) {
  const scenes = world.getResource(SceneAssets)
  const instances = new Query(world, [SceneInstance])
  const spawner = world.getResource(SceneSpawner)

  for (const assetId of spawner.assets()) {
    const scene = scenes.getByAssetId(assetId)

    if (!scene) continue

    const list = spawner.get(assetId)
    for (let i = 0; i < list.length; i++) {
      const entity = new Entity(list[i])
      const instance = instances.get(entity)

      if (!instance) continue

      // TODO: Actually supply a type registry
      //@ts-ignore
      scene.toWorld(world,instance[0],undefined)
    }
    spawner.clear(assetId)
  }
}