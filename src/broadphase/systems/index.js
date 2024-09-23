/** @import { Entity } from "../../ecs/index.js"*/
import { CollisionPairs } from '../resources/index.js'
import { PhysicsHitbox } from '../components/index.js'
import { CollisionPair } from '../core/index.js'
import { Query, World } from '../../ecs/index.js'
import { intersectAABB2D } from '../../geometry/index.js'

/**
 * @param {World} world
 */
export function getCollisionPairs(world) {

  /** @type {CollisionPairs}*/
  const pairs = world.getResource('collisionpairs')

  /** @type {Query<[Entity,PhysicsHitbox]>} */
  const query = new Query(world, ['entity', 'physicshitbox'])

  pairs.clear()

  query.eachCombination(([entityA, boundA], [entityB, boundB]) => {
    if (intersectAABB2D(boundA, boundB)) pairs.push(new CollisionPair(entityA, entityB))
  })
}