import { PlaybackRepeat } from './repeat.js'

export class Playback {

  /**
   * @type {number}
   */
  speed

  /**
   * @type {number}
   */
  duration

  /**
   * @type {number}
   */
  elapsed = 0

  /**
   * @type {PlaybackRepeat}
   */
  repeatMode

  /**
   * @type {boolean}
   */
  paused = false

  /**
   * @param {PlaybackSettings} options
   */
  constructor({
    duration = 1,
    speed = 1,
    repeatMode = PlaybackRepeat.None
  } = {}) {
    this.duration = duration
    this.speed = speed
    this.repeatMode = repeatMode
  }

  /**
   * @param {Playback} source
   * @param {Playback} target
   */
  static copy(source, target = new Playback()) {
    target.duration = source.duration
    target.speed = source.speed
    target.repeatMode = source.repeatMode
    target.elapsed = source.elapsed
    target.paused = source.paused

    return target
  }

  /**
   * @param {Playback} target
   */
  static clone(target) {
    return Playback.copy(target)
  }

  /**
   * @param {Playback} value
   */
  static serialize(value) {
    return {
      speed: value.speed,
      duration: value.duration,
      elapsed: value.elapsed,
      repeatMode: value.repeatMode,
      paused: value.paused
    }
  }

  /**
   * @param {PlaybackSerial} value
   * @param {Playback} [out]
   */
  static deserialize(value, out = new Playback()) {
    out.speed = value.speed
    out.duration = value.duration
    out.elapsed = value.elapsed
    out.repeatMode = value.repeatMode
    out.paused = value.paused

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is PlaybackSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object') {
      return false
    }

    if (!('speed' in value)
      || !('duration' in value)
      || !('elapsed' in value)
      || !('repeatMode' in value)
      || !('paused' in value)
    ) {
      return false
    }

    return typeof value.speed === 'number'
      && typeof value.duration === 'number'
      && typeof value.elapsed === 'number'
      && typeof value.repeatMode === 'number'
      && typeof value.paused === 'boolean'
  }

  start() {
    this.elapsed = 0
    this.play()
  }
  stop() {
    this.elapsed = 0
    this.pause()
  }
  play() {
    this.paused = false
  }
  pause() {
    this.paused = true
  }

  /**
   * @param {number} delta
   */
  update(delta) {
    if (this.paused) {
      return
    }

    const seekTime = this.elapsed + delta * this.speed

    this.elapsed = seekTime
    switch (this.repeatMode) {
      case PlaybackRepeat.None:
        this.elapsed = Math.min(this.duration, seekTime)
        break

      case PlaybackRepeat.Forever:

        this.elapsed %= this.duration
        break
    }
  }
}

/**
 * Serialized form of `Playback`.
 *
 * @typedef PlaybackSerial
 * @property {number} speed
 * @property {number} duration
 * @property {number} elapsed
 * @property {number} repeatMode
 * @property {boolean} paused
 */

/**
 * @typedef PlaybackSettings
 * @property {number} [duration]
 * @property {number} [speed]
 * @property {PlaybackRepeat} [repeatMode]
 */
