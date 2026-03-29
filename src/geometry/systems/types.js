import { World } from '../../ecs/index.js'
import { EnumInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid } from '../../type/index.js'
import { BoundingBox2D, BoundingCircle } from '../AABB/index.js'
import { BoundType } from '../AABB/boundtype.js'
import { Vector2 } from '../../math/index.js'

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
  registry.register(BoundingCircle, new StructInfo({
    type: new Field(boundTypeId),
    r: new Field(typeid(Number)),
    pos: new Field(typeid(Vector2))
  }))
  registry.get(BoundingCircle)?.setMethod(BoundingCircle.copy)
}
