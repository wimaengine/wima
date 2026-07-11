import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Name } from '../components'

/**
 * @param {World} world
 */
export function registerNameTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Name, new StructInfo({
    value: new Field(typeid(String))
  }))
  registry.get(Name)?.setMethod(Name.copy)
  registry.get(Name)?.setMethod(Name.clone)
  registry.get(Name)?.setMethod(Name.serialize)
  registry.get(Name)?.setMethod(Name.deserialize)
}
