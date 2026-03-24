import { Entity, World } from '../../ecs/index.js'
import { ArrayInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Vector2 } from '../../math/index.js'
import { PhysicsHitbox } from '../components/index.js'
import { CollisionPair } from '../core/index.js'
import { Broadphase2D, CollisionPairs } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerBroadphaseTypes2D(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(CollisionPair, new StructInfo({
    a: new Field(typeid(Entity)),
    b: new Field(typeid(Entity))
  }))
  registry.register(PhysicsHitbox, new StructInfo({
    type: new Field(typeid(Number)),
    max: new Field(typeid(Vector2)),
    min: new Field(typeid(Vector2))
  }))
  registry.register(Broadphase2D, new StructInfo({}))
  registry.register(CollisionPairs, new ArrayInfo(typeid(CollisionPair)))
}
