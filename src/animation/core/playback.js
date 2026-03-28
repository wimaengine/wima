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
    return this.copy(target)
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
 * @typedef PlaybackSettings
 * @property {number} [duration]
 * @property {number} [speed]
 * @property {PlaybackRepeat} [repeatMode]
 */
