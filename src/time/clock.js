/**
 * Handles time management for the game.
 */
export class Clock {

  /**
   * @private
   * @type {number}
   */
  elapsed = 0

  /**
   * @private
   * @type {number}
   */
  lastTick = 0

  /**
   * Difference between the last call in the last frame and current call.
   * @private
   * @type {number}
   */
  delta = 0

  /**
   * @private
   * @type {number}
   */
  fps = 0

  /**
   * 
   */
  start() {
    Clock.start(this)
  }

  /**
   * @returns {number}
   */
  getElapsed() {
    return Clock.getElapsed(this)
  }

  /**
   * @returns {number}
   */
  getDelta() {
    return Clock.getDelta(this)
  }

  /**
   * @returns {number}
   */
  getFrameRate() {
    return Clock.getFrameRate(this)
  }

  /**
   * @param {number} accumulate 
   * @returns {number}
   */
  update(accumulate = performance.now()) {
    return Clock.update(this, accumulate)
  }

  /**
   * Starts the clock.
   *
   * @param {Clock} clock
   */
  static start(clock) {
    clock.elapsed = 0
    clock.delta = 0
  }

  /**
   * Gets the elapsed time of the clock.
   *
   * @param {Clock} clock
   */
  static getElapsed(clock) {
    return clock.elapsed
  }

  /**
   * Gets the time between two frames/ticks clock.
   *
   * @param {Clock} clock
   */
  static getDelta(clock) {
    return clock.delta
  }

  /**
   * Gets the frameRate of the clock.
   *
   * @param {Clock} clock
   */
  static getFrameRate(clock) {
    return 1000 / clock.delta
  }

  /**
   * Updates the clock.
   *
   * @param {Clock} clock
   * @param {number} [accumulate]
   */
  static update(clock, accumulate = performance.now()) {
    clock.delta = (accumulate - clock.lastTick) / 1000
    clock.fps = clock.delta ? 1 / clock.delta : 0
    clock.elapsed += clock.delta
    clock.lastTick = accumulate

    return clock.delta
  }
}