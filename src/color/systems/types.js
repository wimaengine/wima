import { World } from '../../ecs/index.js'
import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Color } from '../core/index.js'

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
}
