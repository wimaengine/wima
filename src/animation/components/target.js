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
   * @param {number} player
   * @param {string} id
   */
  constructor(player, id) {
    this.player = player
    this.id = id
  }
}