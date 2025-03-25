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

export class Position2DAnimationEffector extends AnimationEffector {
  static componentType = Position2D

  /**
   * @param {World} world
   * @param {Entity} entity
   * @param {number[]} results
   */
  static apply(world, entity, results) {
    const component = world.get(entity, this.componentType.name.toLowerCase())
    
    component.set(results[0], results[1] )
  }
  static elementSize() {
    return 2
  }
}