import { World, Entity } from '../../ecs/index.js'
import { ArrayInfo, Field, MapInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Angle, Vector2 } from '../../math/index.js'
import { CollisionData, CollisionManifold, Jacobian } from '../core/index.js'
import { Contacts, SATNarrowphase2D } from '../resources/index.js'

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
    entityA: new Field(typeid(Entity)),
    entityB: new Field(typeid(Entity)),
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
}
