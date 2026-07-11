/** @import { Constructor } from '@wimaengine/type' */

import { OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeidGeneric } from '@wimaengine/type'
import { Events } from '../core'

/**
 * @template T
 * @param {Constructor<T>} event
 * @returns {import('@wimaengine/ecs').SystemFunc}
 */
export function registerEventTypes(event) {
  return function registerEventType(world) {
    const registry = world.getResource(TypeRegistry)

    registry.register(event, new StructInfo({}))
    registry.registerTypeId(typeidGeneric(Events, [event]), new OpaqueInfo())
  }
}
