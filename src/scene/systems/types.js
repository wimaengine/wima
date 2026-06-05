/** @import { World } from '../../ecs/index.js' */

import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { HandleSnapshot } from '../../asset/index.js'
import { SceneInstance, SceneInstanceSnapshot } from '../components/index.js'

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
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.prototype.fromSnapshot)
}
