/** @import { Constructor } from '../../type/index.js' */

import { OpaqueInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { Events } from '../core/index.js'
import { typeidGeneric } from '../../type/index.js'

/**
 * @template T
 * @param {Constructor<T>} event
 * @returns {import('../../ecs/index.js').SystemFunc}
 */
export function registerEventTypes(event) {
  return function registerEventType(world) {
    const registry = world.getResource(TypeRegistry)

    registry.register(event, new StructInfo({}))
    registry.registerTypeId(typeidGeneric(Events, [event]), new OpaqueInfo())
  }
}
