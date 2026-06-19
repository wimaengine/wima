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

  /**
   * @param {Timer} source
   * @param {Timer} target
   */
  static copy(source, target = new Timer()) {
    target.mode = source.mode
    target.duration = source.duration
    target.speed = source.speed
    target.paused = source.paused
    target.elapsedCount = source.elapsedCount
    target.elapsedTime = source.elapsedTime
    target.finished = source.finished
    target.startTicks = source.startTicks
    target.endTicks = source.endTicks
    target.playbackRequested = source.playbackRequested
    target.playbackResolved = source.playbackResolved

    return target
  }

  /**
   * @param {Timer} target
   */
  static clone(target) {
    return Timer.copy(target)
  }

  /**
   * @param {Timer} value
   */
  static serialize(value) {
    return {
      mode: value.mode,
      duration: value.duration,
      speed: value.speed,
      paused: value.paused,
      elapsedCount: value.elapsedCount,
      elapsedTime: value.elapsedTime,
      finished: value.finished,
      startTicks: value.startTicks,
      endTicks: value.endTicks,
      playbackRequested: value.playbackRequested,
      playbackResolved: value.playbackResolved
    }
  }

  /**
   * @param {TimerSerial} value
   * @param {Timer} [out]
   */
  static deserialize(value, out = new Timer()) {
    out.mode = value.mode
    out.duration = value.duration
    out.speed = value.speed
    out.paused = value.paused
    out.elapsedCount = value.elapsedCount
    out.elapsedTime = value.elapsedTime
    out.finished = value.finished
    out.startTicks = value.startTicks
    out.endTicks = value.endTicks
    out.playbackRequested = value.playbackRequested
    out.playbackResolved = value.playbackResolved

    return out
  }

  /**
   * @param {TimerSerial} value
   * @returns {value is TimerSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('mode' in value) ||
      !('duration' in value) ||
      !('speed' in value) ||
      !('paused' in value) ||
      !('elapsedCount' in value) ||
      !('elapsedTime' in value) ||
      !('finished' in value) ||
      !('startTicks' in value) ||
      !('endTicks' in value) ||
      !('playbackRequested' in value) ||
      !('playbackResolved' in value)
    ) {
      return false
    }

    return typeof value.mode === 'number' &&
      typeof value.duration === 'number' &&
      typeof value.speed === 'number' &&
      typeof value.paused === 'boolean' &&
      typeof value.elapsedCount === 'number' &&
      typeof value.elapsedTime === 'number' &&
      typeof value.finished === 'boolean' &&
      typeof value.startTicks === 'number' &&
      typeof value.endTicks === 'number' &&
      typeof value.playbackRequested === 'boolean' &&
      typeof value.playbackResolved === 'boolean'
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
 * @typedef TimerSerial
 * @property {TimerMode} mode
 * @property {number} duration
 * @property {number} speed
 * @property {boolean} paused
 * @property {number} elapsedCount
 * @property {number} elapsedTime
 * @property {boolean} finished
 * @property {number} startTicks
 * @property {number} endTicks
 * @property {boolean} playbackRequested
 * @property {boolean} playbackResolved
 */

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
