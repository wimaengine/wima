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

  /**
   * @template U
   * @param {Tween<U>} source
   * @param {Tween<U>} target
   */
  static copy(source, target = new this(source.to, source.from, source.duration, source.repeat, source.flip, source.easing)) {
    const cloneValue = (/** @type {U} */ value) => {
      if (!value || typeof value !== 'object') {
        return value
      }

      const ctor = value.constructor

      // @ts-ignore
      if (ctor && typeof ctor.copy === 'function') {

        // @ts-ignore
        return ctor.copy(value)
      }

      throw `The source cannot be copied with value type \`${ctor.name}\``
    }

    target.duration = source.duration
    target.finish = source.finish
    target.to = cloneValue(source.to)
    target.from = cloneValue(source.from)
    target.easing = source.easing
    target.timeTaken = source.timeTaken
    target.repeat = source.repeat
    target.flip = source.flip

    return target
  }

  /**
   * @template U
   * @param {Tween<U>} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
