import { World } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { BoundingBox2D, BoundingCircle, BoundType } from '../AABB'

/**
 * @param {World} world
 */
export function registerGeometryTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const boundTypeId = setTypeId('BoundType')

  registry.registerTypeId(boundTypeId, new EnumInfo(BoundType))

  registry.register(BoundingBox2D, new StructInfo({
    type: new Field(boundTypeId),
    max: new Field(typeid(Vector2)),
    min: new Field(typeid(Vector2))
  }))
  registry.get(BoundingBox2D)?.setMethod(BoundingBox2D.copy)
  registry.get(BoundingBox2D)?.setMethod(BoundingBox2D.serialize)
  registry.get(BoundingBox2D)?.setMethod(BoundingBox2D.deserialize)
  registry.register(BoundingCircle, new StructInfo({
    type: new Field(boundTypeId),
    r: new Field(typeid(Number)),
    pos: new Field(typeid(Vector2))
  }))
  registry.get(BoundingCircle)?.setMethod(BoundingCircle.copy)
  registry.get(BoundingCircle)?.setMethod(BoundingCircle.serialize)
  registry.get(BoundingCircle)?.setMethod(BoundingCircle.deserialize)
}
