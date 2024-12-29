export class AnimationTarget {
  /**
   * @type {Entity}
   */
  player
  /**
   * @type {string}
   */
  id
  constructor(player,id) {
    this.player = player
    this.id = id
  }
}