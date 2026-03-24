import { World } from '../../ecs/index.js'
import { OpaqueInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { Touches } from '../resources/touches.js'

/**
 * @param {World} world
 */
export function registerTouchTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Touches, new OpaqueInfo())
}
