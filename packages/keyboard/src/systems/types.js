import { World } from '@wimaengine/ecs'
import { OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
import { Keyboard } from '../resources'

/**
 * @param {World} world
 */
export function registerKeyboardTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Keyboard, new OpaqueInfo())
}
