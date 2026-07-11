/** @import { EntityHandle } from "@wimaengine/ecs"*/
import { BoundingBox2D, BoundingCircle } from '@wimaengine/geometry'
import { Vector2 } from '@wimaengine/math'

export class Broadphase2D {

  /**
   * @private
   * @type {Broadphasable2D}
   */
  inner

  /**
   * @param {Broadphasable2D} broadphasable
   */
  constructor(broadphasable) {
    this.inner = broadphasable
  }

  /**
   * @param {BoundingBox2D} bound
   * @param {EntityHandle[]} [target=[]]
   */
  queryBox(bound, target = []) {
    return this.inner.queryBox(bound, target)
  }

  /**
   * @param {BoundingCircle} bound
   * @param {EntityHandle[]} target
   */
  queryCircle(bound, target = []) {
    return this.inner.queryCircle(bound, target)
  }

  /**
   * @param {Vector2} point
   * @param {EntityHandle[]} [target=[]]
   */
  queryPoint(point, target = []) {
    return this.inner.queryPoint(point, target)
  }
  clear() {
    this.inner.clear()
  }

  /**
   * @param {EntityHandle} entity
   * @param {BoundingBox2D} broadphase
   */
  push(entity, broadphase) {
    this.inner.push(entity, broadphase)
  }
}

/**
 * @typedef Broadphasable2D
 * @property {(bound:BoundingBox2D,target?:EntityHandle[])=>EntityHandle[]} queryBox
 * @property {(bound:BoundingCircle,target?:EntityHandle[])=>EntityHandle[]} queryCircle
 * @property {(bound:Vector2,target?:EntityHandle[])=>EntityHandle[]} queryPoint
 * @property {(entity:EntityHandle,bound:BoundingBox2D)=>void} push
 * @property {()=>void} clear
 */
