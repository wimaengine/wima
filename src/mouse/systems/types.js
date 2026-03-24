import { World } from '../../ecs/index.js'
import { Field, OpaqueInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Vector2 } from '../../math/index.js'
import { Mouse, MouseButtons } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerMouseTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Mouse, new StructInfo({
    lastPosition: new Field(typeid(Vector2)),
    position: new Field(typeid(Vector2)),
    delta: new Field(typeid(Vector2))
  }))
  registry.register(MouseButtons, new OpaqueInfo())
}
