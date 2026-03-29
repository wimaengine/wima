import { World } from '../../ecs/index.js'
import { ArrayInfo, EnumInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid, typeidGeneric } from '../../type/index.js'
import { Vector2 } from '../../math/index.js'
import { Collider2D, PhysicsProperties, SoftBody2D, SoftBody3D } from '../components/index.js'
import { Geometry } from '../core/index.js'
import { ShapeType } from '../settings.js'

/**
 * @param {World} world
 */
export function registerPhysicsTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const shapeTypeId = setTypeId('ShapeType')
  const vector2ArrayId = typeidGeneric(Array, [Vector2])
  const bigIntId = setTypeId('BigInt')

  registry.registerTypeId(shapeTypeId, new EnumInfo(ShapeType))
  registry.registerTypeId(vector2ArrayId, new ArrayInfo(typeid(Vector2)))

  registry.register(Collider2D, new StructInfo({
    type: new Field(shapeTypeId),
    angle: new Field(typeid(Number)),
    vertices: new Field(vector2ArrayId),
    geometry: new Field(typeid(Geometry))
  }))
  registry.get(Collider2D)?.setMethod(Collider2D.copy)
  registry.get(Collider2D)?.setMethod(Collider2D.clone)
  registry.register(PhysicsProperties, new StructInfo({
    invinertia: new Field(typeid(Number)),
    invmass: new Field(typeid(Number)),
    mask: new Field(bigIntId),
    group: new Field(bigIntId),
    sleep: new Field(typeid(Boolean)),
    restitution: new Field(typeid(Number)),
    kineticFriction: new Field(typeid(Number))
  }))
  registry.get(PhysicsProperties)?.setMethod(PhysicsProperties.copy)
  registry.get(PhysicsProperties)?.setMethod(PhysicsProperties.clone)
  registry.register(SoftBody2D, new StructInfo({}))
  registry.get(SoftBody2D)?.setMethod(SoftBody2D.copy)
  registry.get(SoftBody2D)?.setMethod(SoftBody2D.clone)
  registry.register(SoftBody3D, new StructInfo({}))
  registry.get(SoftBody3D)?.setMethod(SoftBody3D.copy)
  registry.get(SoftBody3D)?.setMethod(SoftBody3D.clone)
}
