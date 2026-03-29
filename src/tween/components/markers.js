export class TweenRepeat {

  /**
   * @param {TweenRepeat} source
   * @param {TweenRepeat} target
   */
  static copy(source, target = new TweenRepeat()) {
    return target
  }

  /**
   * @param {TweenRepeat} target
   */
  static clone(target) {
    return this.copy(target)
  }
}

export class TweenFlip { }
