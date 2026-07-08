import { World } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { Field, OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Mouse, MouseButtons } from '../resources'

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
