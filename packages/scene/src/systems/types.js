/** @import { World } from '@wimaengine/ecs' */

import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { HandleSnapshot } from '@wimaengine/asset'
import { SceneInstance, SceneInstanceSnapshot } from '../components'

/**
 * @param {World} world
 */
export function registerSceneTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(SceneInstance, new StructInfo({
    handle: new Field(typeid(HandleSnapshot))
  }))
  registry.get(SceneInstance)?.setMethod(SceneInstance.prototype.toSnapshot)

  registry.register(SceneInstanceSnapshot, new StructInfo({
    handle: new Field(typeid(HandleSnapshot))
  }))
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.serialize)
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.deserialize)
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.prototype.fromSnapshot)
}
