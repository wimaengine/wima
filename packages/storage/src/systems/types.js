import { World } from '@wimaengine/ecs'
import { OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
import { Cookies, Session, Storage } from '../resources'

/**
 * @param {World} world
 */
export function registerStorageTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Session, new OpaqueInfo())
  registry.register(Storage, new OpaqueInfo())
  registry.register(Cookies, new OpaqueInfo())
}
