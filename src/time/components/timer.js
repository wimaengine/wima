import { clamp } from '../../math/index.js'

export class Timer {

  /**
   * @type {TimerMode}
   */
  mode

  /**
   * @type {number}
   */
  duration

  /**
   * @type {number}
   */
  speed

  /**
   * @type {boolean}
   */
  paused

  /**
   * @private
   * @type {number}
   */
  elapsedCount = 0

  /**
   * @private
   * @type {number}
   */
  elapsedTime = 0

  /**
   * @private
   * @type {boolean}
   */
  finished = false

  /**
   * @private
   * @type {number}
   */
  startTicks = 0

  /**
   * @private
   * @type {number}
   */
  endTicks = 0

  /**
   * Part of change detection for when playback is changed.
   * @private
   * @type {boolean}
   */
  playbackRequested = false

  /**
   * Part of change detection for when playback is changed.
   * @private
   * @type {boolean}
   */
  playbackResolved = false

  /**
   * @param {TimerOptions} options
   */
  constructor({
    duration = 1,
    mode = TimerMode.Once,
    speed = 1,
    paused = false
  } = {}) {
    this.duration = duration
    this.mode = mode
    this.speed = speed
    this.paused = paused
  }

  elapsed() {
    return this.elapsedTime
  }

  progress() {
    return this.elapsedTime / this.duration
  }

  play() {
    this.paused = false
    this.requestPlayback()
  }

  pause() {
    this.paused = true
    this.requestPlayback()
  }

  start() {
    this.elapsedCount = 0
    this.elapsedTime = 0
    this.play()
  }

  stop() {
    this.elapsedCount = 0
    this.elapsedTime = 0
    this.pause()
  }

  reset() {
    this.start()
  }

  /**
   * @param {number} timestamp
   */
  seek(timestamp) {
    this.elapsedTime = clamp(timestamp, 0, this.duration)
    this.requestPlayback()
  }

  requestPlayback() {
    this.playbackRequested = true
    this.finished = false
  }

  playbackChanged() {
    return this.playbackResolved
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    const previousElapsedTime = this.elapsedTime

    this.startTicks = 0
    this.endTicks = 0
    this.playbackResolved = false

    if (this.playbackRequested) {
      this.playbackResolved = true
      this.playbackRequested = false
    }
    if (this.paused || this.finished) {
      return
    }

    this.elapsedTime += dt * this.speed
    this.endTicks = Math.floor(this.elapsedTime / this.duration)

    if (this.endTicks) {
      if (this.mode === TimerMode.Once) {
        this.elapsedTime = this.duration
        this.finished = true
        this.elapsedCount = 1
      } else if (this.mode === TimerMode.Repeat) {
        this.elapsedCount += this.endTicks
        this.elapsedTime = this.elapsedTime % this.duration
      }
    }

    if (
      (!previousElapsedTime && this.elapsedTime) ||
      previousElapsedTime > this.elapsedTime) {
      this.startTicks = 1
    }
  }

  /**
   * @returns {boolean}
   */
  cycleStarted() {
    return this.startTicks > 0
  }

  /**
   * @returns {boolean}
   */
  cycleEnded() {
    return this.endTicks > 0
  }

  /**
   * @returns {number}
   */
  cyclesCompleted() {
    return this.elapsedCount
  }

  /**
   * @returns {number}
   */
  cyclesCompletedThisFrame() {
    return this.endTicks
  }

  /**
   * @returns {boolean}
   */
  completed() {
    return this.finished
  }
}

/**
 * @readonly
 * @enum {number}
 */
export const TimerMode = {
  Once: 0,
  Repeat: 1
}

/**
 * @typedef TimerOptions
 * @property {number} [duration]
 * @property {TimerMode} [mode]
 * @property {number} [speed]
 * @property {boolean} [paused]
 */
