import { World } from '../../ecs/index.js'
import { OpaqueInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { Keyboard } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerKeyboardTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Keyboard, new OpaqueInfo())
}
