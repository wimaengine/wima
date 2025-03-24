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
    duration,
    speed = 1,
    repeatMode = PlaybackRepeat.None
  }) {
    this.duration = duration
    this.speed = speed
    this.repeatMode = repeatMode
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
 * @property {number} duration
 * @property {number} [speed]
 * @property {PlaybackRepeat} [repeatMode]
 */