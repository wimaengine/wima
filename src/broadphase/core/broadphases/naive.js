/** @import {Entity} from '../../../ecs/index.js' */
import { BoundingBox2D, BoundingCircle, intersectAABB2D, intersectAABB2DvsCircle } from '../../../geometry/index.js'
import { Vector2 } from '../../../math/index.js'
import { PhysicsHitbox } from '../../components/index.js'

/**
 * Most basic broadphase.Should be used when number of bodies are
 * few(i.e less than 100).
 */
export class NaiveBroadphase2D {

  /**
   * @private
   * @type {Entity[]}
   */
  entities = []

  /**
   * @private
   * @type {PhysicsHitbox[]}
   */
  bounds = []

  /**
   * @param {BoundingBox2D} bound - Region to check in.
   * @param {Entity[]} target - Empty array to store results.
   * @returns {Entity[]}
   */
  queryBox(bound, target = []) {
    for (let i = 0; i < this.entities.length; i++) if (intersectAABB2D(bound, this.bounds[i])) target.push(this.entities[i])

    return target
  }

  /**
   * @param {BoundingCircle} bound - Region to check in.
   * @param {Entity[]} target - Empty array to store results.
   * @returns {Entity[]}
   */
  queryCircle(bound, target = []) {
    for (let i = 0; i < this.entities.length; i++) if (intersectAABB2DvsCircle(this.bounds[i], bound)) target.push(this.entities[i])

    return target
  }

  /**
   * @param {Vector2} _point - Region to check in.
   * @param {Entity[]} target - Empty array to store results.
   * @returns {Entity[]}
   */
  queryPoint(_point, target = []) {
    for (let i = 0; i < this.entities.length; i++) {

      // TODO: Actually implement this
    }

    return target
  }

  /**
   * Clears all the stored entities.
   */
  clear() {
    this.entities = []
    this.bounds = []
  }

  /**
   * @param {Entity} entity
   * @param {PhysicsHitbox} bound
   */
  push(entity, bound) {
    this.entities.push(entity)
    this.bounds.push(bound)
  }
}