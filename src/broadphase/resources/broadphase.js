/** @import { Entity } from "../../ecs/index.js"*/
import { BoundingBox2D, BoundingCircle } from '../../geometry/index.js'
import { Vector2 } from '../../math/index.js'

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
   * @param {Entity[]} [target=[]]
   */
  queryBox(bound, target = []) {
    return this.inner.queryBox(bound, target)
  }

  /**
   * @param {BoundingCircle} bound
   * @param {Entity[]} target
   */
  queryCircle(bound, target = []) {
    return this.inner.queryCircle(bound, target)
  }

  /**
   * @param {Vector2} point
   * @param {Entity[]} [target=[]]
   */
  queryPoint(point, target = []) {
    return this.inner.queryPoint(point, target)
  }
  clear(){
    this.inner.clear()
  }

  /**
   * @param {Entity} entity
   * @param {BoundingBox2D} broadphase
   */
  push(entity, broadphase){
    this.inner.push(entity, broadphase)
  }
}

/**
 * @typedef Broadphasable2D
 * @property {(bound:BoundingBox2D,target?:Entity[])=>Entity[]} queryBox
 * @property {(bound:BoundingCircle,target?:Entity[])=>Entity[]} queryCircle
 * @property {(bound:Vector2,target?:Entity[])=>Entity[]} queryPoint
 * @property {(entity:Entity,bound:BoundingBox2D)=>void} push
 * @property {()=>void} clear
 */