import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { intersectAABB2D } from '@wimaengine/geometry'
import { PhysicsHitbox } from '../components'
import { CollisionPair } from '../core'
import { Broadphase2D, CollisionPairs } from '../resources'

/**
 * @param {World} world
 */
export function getCollisionPairs(world) {
  const pairs = world.getResource(CollisionPairs)
  const query = new Query(world, [EntityHandle, PhysicsHitbox])

  pairs.clear()

  query.eachCombination(([entityA, boundA], [entityB, boundB]) => {
    if (intersectAABB2D(boundA, boundB)) pairs.push(new CollisionPair(entityA, entityB))
  })
}

/**
 * @param {World} world
 */
export function updateBroadphase2D(world) {
  const broadphase = world.getResource(Broadphase2D)
  const query = new Query(world, [EntityHandle, PhysicsHitbox])

  broadphase.clear()

  query.each(([entity, bound]) => {
    broadphase.push(entity, bound)
  })
}
