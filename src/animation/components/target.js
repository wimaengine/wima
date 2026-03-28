/** @import { Entity } from '../../ecs/index.js' */

export class AnimationTarget {

  /**
   * @type {Entity}
   */
  player

  /**
   * @type {string}
   */
  id

  /**
   * @param {Entity} player
   * @param {string} id
   */
  constructor(player, id) {
    this.player = player
    this.id = id
  }

  /**
   * @param {AnimationTarget} source
   * @param {AnimationTarget} target
   */
  static copy(source, target = new AnimationTarget(source.player, source.id)) {
    target.player = source.player
    target.id = source.id

    return target
  }

  /**
   * @param {AnimationTarget} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
