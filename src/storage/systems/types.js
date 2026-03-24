import { World } from '../../ecs/index.js'
import { OpaqueInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { Cookies, Session, Storage } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerStorageTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Session, new OpaqueInfo())
  registry.register(Storage, new OpaqueInfo())
  registry.register(Cookies, new OpaqueInfo())
}
