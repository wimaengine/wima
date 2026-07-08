import { World } from '@wimaengine/ecs'
import { ArrayInfo, EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { Vector2 } from '@wimaengine/math'
import { Collider2D, PhysicsProperties, SoftBody2D, SoftBody3D } from '../components'
import { Geometry } from '../core'
import { ShapeType } from '../settings'

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
  registry.get(Collider2D)?.setMethod(Collider2D.serialize)
  registry.get(Collider2D)?.setMethod(Collider2D.deserialize)
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
  registry.get(PhysicsProperties)?.setMethod(PhysicsProperties.serialize)
  registry.get(PhysicsProperties)?.setMethod(PhysicsProperties.deserialize)
  registry.register(SoftBody2D, new StructInfo({}))
  registry.get(SoftBody2D)?.setMethod(SoftBody2D.copy)
  registry.get(SoftBody2D)?.setMethod(SoftBody2D.clone)
  registry.get(SoftBody2D)?.setMethod(SoftBody2D.serialize)
  registry.get(SoftBody2D)?.setMethod(SoftBody2D.deserialize)
  registry.register(SoftBody3D, new StructInfo({}))
  registry.get(SoftBody3D)?.setMethod(SoftBody3D.copy)
  registry.get(SoftBody3D)?.setMethod(SoftBody3D.clone)
  registry.get(SoftBody3D)?.setMethod(SoftBody3D.serialize)
  registry.get(SoftBody3D)?.setMethod(SoftBody3D.deserialize)
}
