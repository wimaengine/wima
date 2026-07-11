import { EntityHandle, World } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { ArrayInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { PhysicsHitbox } from '../components'
import { CollisionPair } from '../core'
import { Broadphase2D, CollisionPairs } from '../resources'

/**
 * @param {World} world
 */
export function registerBroadphaseTypes2D(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(CollisionPair, new StructInfo({
    a: new Field(typeid(EntityHandle)),
    b: new Field(typeid(EntityHandle))
  }))
  registry.register(PhysicsHitbox, new StructInfo({
    type: new Field(typeid(Number)),
    max: new Field(typeid(Vector2)),
    min: new Field(typeid(Vector2))
  }))
  registry.get(PhysicsHitbox)?.setMethod(PhysicsHitbox.copy)
  registry.get(PhysicsHitbox)?.setMethod(PhysicsHitbox.clone)
  registry.get(PhysicsHitbox)?.setMethod(PhysicsHitbox.serialize)
  registry.get(PhysicsHitbox)?.setMethod(PhysicsHitbox.deserialize)
  registry.register(Broadphase2D, new StructInfo({}))
  registry.register(CollisionPairs, new ArrayInfo(typeid(CollisionPair)))
}
