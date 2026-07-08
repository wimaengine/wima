import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Color } from '../core'

/**
 * @param {World} world
 */
export function registerColorTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Color, new StructInfo({
    r: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    a: new Field(typeid(Number))
  }))
  registry.get(Color)?.setMethod(Color.copy)
  registry.get(Color)?.setMethod(Color.serialize)
  registry.get(Color)?.setMethod(Color.deserialize)
}
