/** @import { AnimationEffectorEnforcer } from '../core/index.js' */
import { lerp } from '../../math/index.js'

export class AnimationTrack {

  /**
   * @type {number[]}
   */
  times = []

  /**
   * @type {number[]}
   */
  keyframes = []

  /**
   * @type {AnimationEffectorEnforcer}
   */
  effector

  /**
   * @param {AnimationEffectorEnforcer} effector
   */
  constructor(effector) {
    this.effector = effector
  }
  validate() {

    // Validates keyframe times are in ascending order
    for (let i = 1; i < this.times.length; i++) {
      const last = this.times[i - 1]
      const current = this.times[i]

      if (last > current) {
        return false
      }
    }

    // the len of keyframes is equal to times
    if (this.keyframes.length / this.effector.elementSize() !== this.times.length) {
      return false
    }

    return true
  }

  length() {
    return this.times.length
  }

  /**
   * @param {AnimationTrack} value
   */
  static serialize(value) {
    return {
      times: value.times.slice(),
      keyframes: value.keyframes.slice(),
      effector: value.effector
    }
  }

  /**
   * @param {AnimationTrackSerial} value
   * @param {AnimationTrack} [out]
   */
  static deserialize(value, out = new AnimationTrack(/** @type {any} */ (null))) {
    out.times = value.times.slice()
    out.keyframes = value.keyframes.slice()
    out.effector = value.effector

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is AnimationTrackSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('times' in value) || !('keyframes' in value) || !('effector' in value)) {
      return false
    }

    if (!Array.isArray(value.times) || !Array.isArray(value.keyframes)) {
      return false
    }

    for (let i = 0; i < value.times.length; i++) {
      if (typeof value.times[i] !== 'number') {
        return false
      }
    }

    for (let i = 0; i < value.keyframes.length; i++) {
      if (typeof value.keyframes[i] !== 'number') {
        return false
      }
    }

    return value.effector !== undefined && value.effector !== null
  }

  /**
   * @param {any} delta
   */
  getCurrent(delta) {
    const [indexA, indexB, t] = this.getCurrentLerp(delta)

    const computed = []
    const elementSize = this.effector.elementSize()

    for (let i = 0; i < elementSize; i++) {
      const a = this.keyframes[indexA * elementSize + i]
      const b = this.keyframes[indexB * elementSize + i]

      const value = lerp(a, b, t)

      computed[i] = value
    }

    return computed
  }

  /**
   * @param {number} delta
   * @returns {[number,number,number]}
   */
  getCurrentLerp(delta) {
    const lastindex = this.times.length - 1
    let timestamp = 0

    if (delta <= this.times[0]) {
      return [0, 0, 0]
    }
    if (delta >= this.times[lastindex]) {
      return [lastindex, lastindex, 0]
    }

    for (let i = 0; i < this.times.length; i++) {
      if (this.times[i] >= delta) {
        timestamp = i
        break
      }
    }

    const start = this.times[timestamp - 1]
    const end = this.times[timestamp]

    const distance = start - end
    const covered = start - delta
    const centage = covered / distance

    return [timestamp - 1, timestamp, centage]
  }
}

/**
 * Serialized form of `AnimationTrack`.
 *
 * @typedef AnimationTrackSerial
 * @property {number[]} times
 * @property {number[]} keyframes
 * @property {any} effector
 */
