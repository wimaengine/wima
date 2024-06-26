export class Timer {

  /**
   * @type {TimerMode}
   */
  mode

  /**
   * @type {number}
   */
  elapsed = 0

  /**
   * @type {number}
   */
  duration = 0

  /**
   * @type {boolean}
   */
  finished = false

  /**
   * @param {number} duration
   * @param {TimerMode} [mode=TimerMode.Once]
   */
  constructor(duration, mode = TimerMode.Once) {
    this.duration = duration
    this.mode = mode
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    Timer.update(this, dt)
  }
  reset() {
    Timer.reset(this)
  }

  /**
   * @param {Timer} timer
   * @param {number} dt
   */
  static update(timer, dt) {
    timer.elapsed += dt
    timer.finished = false

    if (timer.elapsed >= timer.duration) {
      timer.finished = true

      if (timer.mode === TimerMode.Repeat) timer.elapsed = 0
    }
  }

  /**
   * @param {Timer} timer
   */
  static reset(timer) {
    timer.elapsed = 0
    timer.finished = false
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