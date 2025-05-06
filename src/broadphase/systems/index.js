import { Broadphase2D, CollisionPairs } from '../resources/index.js'
import { PhysicsHitbox } from '../components/index.js'
import { CollisionPair } from '../core/index.js'
import { Entity, Query, World } from '../../ecs/index.js'
import { intersectAABB2D } from '../../geometry/index.js'

/**
 * @param {World} world
 */
export function getCollisionPairs(world) {

  /** @type {CollisionPairs}*/
  const pairs = world.getResource('collisionpairs')
  const query = new Query(world, [Entity, PhysicsHitbox])

  pairs.clear()

  query.eachCombination(([entityA, boundA], [entityB, boundB]) => {
    if (intersectAABB2D(boundA, boundB)) pairs.push(new CollisionPair(entityA, entityB))
  })
}

/**
 * @param {World} world
 */
export function updateBroadphase2D(world) {

  /** @type {Broadphase2D}*/
  const broadphase = world.getResource('broadphase2d')

  /** @type {Query<[Entity,PhysicsHitbox]>} */
  const query = new Query(world, ['entity', 'physicshitbox'])

  broadphase.clear()

  query.each(([entity, bound]) => {
    broadphase.push(entity, bound)
  })
}