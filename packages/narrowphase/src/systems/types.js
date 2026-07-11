import { World, EntityHandle } from '@wimaengine/ecs'
import { Angle, Vector2 } from '@wimaengine/math'
import { ArrayInfo, EnumInfo, Field, MapInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { Collider2D, PhysicsProperties, SoftBody2D, SoftBody3D } from '../components'
import { CollisionData, CollisionManifold, Geometry, Jacobian } from '../core'
import { Contacts, SATNarrowphase2D } from '../resources'
import { ShapeType } from '../settings'

/**
 * @param {World} world
 */
export function registerNarrowphase2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const collisionManifoldMapId = typeidGeneric(Map, [String, CollisionManifold])
  const numberArrayId = typeidGeneric(Array, [Number])
  const vector2ArrayId = typeidGeneric(Array, [Vector2])
  const jacobianArrayId = typeidGeneric(Array, [Jacobian])

  registry.registerTypeId(collisionManifoldMapId, new MapInfo(typeid(String), typeid(CollisionManifold)))
  registry.registerTypeId(numberArrayId, new ArrayInfo(typeid(Number)))
  registry.registerTypeId(vector2ArrayId, new ArrayInfo(typeid(Vector2)))
  registry.registerTypeId(jacobianArrayId, new ArrayInfo(typeid(Jacobian)))

  registry.register(Jacobian, new StructInfo({
    va: new Field(typeid(Vector2)),
    wa: new Field(typeid(Number)),
    vb: new Field(typeid(Vector2)),
    wb: new Field(typeid(Number))
  }))
  registry.register(CollisionData, new StructInfo({
    overlap: new Field(typeid(Number)),
    done: new Field(typeid(Boolean)),
    axis: new Field(typeid(Vector2)),
    tangent: new Field(typeid(Vector2)),
    contactPoints: new Field(vector2ArrayId),
    contactNo: new Field(typeid(Number))
  }))
  registry.register(CollisionManifold, new StructInfo({
    entityA: new Field(typeid(EntityHandle)),
    entityB: new Field(typeid(EntityHandle)),
    velocityA: new Field(typeid(Vector2)),
    velocityB: new Field(typeid(Vector2)),
    rotationA: new Field(typeid(Angle)),
    rotationB: new Field(typeid(Angle)),
    positionA: new Field(typeid(Vector2)),
    positionB: new Field(typeid(Vector2)),
    contactData: new Field(typeid(CollisionData)),
    impulse: new Field(numberArrayId),
    tImpulse: new Field(numberArrayId),
    nbias: new Field(numberArrayId),
    nJacobian: new Field(jacobianArrayId),
    tJacobian: new Field(jacobianArrayId),
    restitution: new Field(typeid(Number)),
    staticFriction: new Field(typeid(Number)),
    kineticFriction: new Field(typeid(Number)),
    effectiveMass: new Field(numberArrayId),
    nLambda: new Field(numberArrayId),
    tLambda: new Field(numberArrayId),
    invmassA: new Field(typeid(Number)),
    invmassB: new Field(typeid(Number)),
    invinertiaA: new Field(typeid(Number)),
    invinertiaB: new Field(typeid(Number))
  }))

  registry.register(Contacts, new ArrayInfo(typeid(CollisionManifold)))
  registry.register(SATNarrowphase2D, new StructInfo({
    clmdrecord: new Field(collisionManifoldMapId)
  }))

  const shapeTypeId = setTypeId('ShapeType')
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
