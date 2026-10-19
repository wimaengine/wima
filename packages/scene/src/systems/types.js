/** @import { World } from '@wimaengine/ecs' */

import { HandleSnapshot } from '@wimaengine/asset'
import { ArrayInfo, EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { SceneFilter, SceneFilterMode } from '../assets'
import { SceneInstance, SceneInstanceSnapshot } from '../components'

/**
 * @param {World} world
 */
export function registerSceneTypes(world) {
  const registry = world.getResource(TypeRegistry)
  const sceneFilterModeId = setTypeId('SceneFilterMode')
  const typeIdArrayId = typeidGeneric(Array, [String])

  registry.registerTypeId(sceneFilterModeId, new EnumInfo(SceneFilterMode))
  registry.registerTypeId(typeIdArrayId, new ArrayInfo(typeid(String)))
  registry.register(SceneFilter, new StructInfo({
    typeIds: new Field(typeIdArrayId),
    mode: new Field(sceneFilterModeId)
  }))

  registry.register(SceneInstance, new StructInfo({
    handle: new Field(typeid(HandleSnapshot)),
    filter: new Field(typeid(HandleSnapshot), true)
  }))
  registry.get(SceneInstance)?.setMethod(SceneInstance.prototype.toSnapshot)

  registry.register(SceneInstanceSnapshot, new StructInfo({
    handle: new Field(typeid(HandleSnapshot)),
    filter: new Field(typeid(HandleSnapshot), true)
  }))
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.serialize)
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.deserialize)
  registry.get(SceneInstanceSnapshot)?.setMethod(SceneInstanceSnapshot.prototype.fromSnapshot)
}
