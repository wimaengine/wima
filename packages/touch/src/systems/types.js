import { World } from '@wimaengine/ecs'
import { OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
import { Touches } from '../resources'

/**
 * @param {World} world
 */
export function registerTouchTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Touches, new OpaqueInfo())
}
