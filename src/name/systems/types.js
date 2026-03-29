import { World } from '../../ecs/index.js'
import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Name } from '../components/index.js'

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
}
