/** @import { Entity } from '../../ecs/index.js' */
import { World } from '../../ecs/registry.js'
import { Position2D, Orientation2D, Scale2D, Position3D, Orientation3D, Scale3D } from '../../transform/index.js'

/**
 * @abstract
 */
export class AnimationEffector {
  elementSize(){
    const { constructor } = this

    // @ts-ignore
    return constructor.elementSize()
  }

  /**
   * @param {World} _world
   * @param {Entity} _entity
   * @param {number[]} _results
   */
  static apply(_world, _entity, _results) {}
  static elementSize() {
    return 0
  }
}