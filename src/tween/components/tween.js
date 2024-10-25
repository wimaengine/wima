/** @import { EasingFn } from '../typedef/index.js' */
import { Easing } from '../core/index.js'

/**
 * Component responsible for animations.
 *
 * @template T
 */
export class Tween {

  /**
   * @type {number}
   */
  duration = 0

  /**
   * @type {boolean}
   */
  finish = false

  /**
   * @type {T}
   * @private
   */
  to

  /**
   * @type {T}
   */
  from

  /**
   * @type {EasingFn}
   */
  easing

  /**
   * @type {number}
   */
  timeTaken = 0

  /**
   * @param {T} to
   * @param {T} from
   * @param {number} duration
   * @param {boolean} [repeat=false]
   * @param {boolean} [flip=true]
   * @param {EasingFn} [easing=Easing.linear]
   */
  constructor(to, from, duration, repeat = false, flip = true, easing = Easing.linear) {
    this.to = to
    this.from = from
    this.repeat = repeat
    this.flip = flip
    this.duration = duration
    this.easing = easing
  }
}