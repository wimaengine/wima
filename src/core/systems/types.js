import { EntityHandle, World } from '../../ecs/index.js'
import { Field, StructInfo, TypeRegistry } from '../../reflect/index.js'
import { typeid } from '../../type/index.js'

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
