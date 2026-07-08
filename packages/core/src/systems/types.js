import { EntityHandle, World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'

/**
 * @param {World} world
 */
export function registerCoreTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(EntityHandle, new StructInfo({
    index: new Field(typeid(Number)),
    generation: new Field(typeid(Number))
  }))
  registry.get(EntityHandle)?.setMethod(EntityHandle.serialize)
  registry.get(EntityHandle)?.setMethod(EntityHandle.deserialize)
}
