import { World } from '../../../ecs/index.js'
import { Schedule } from '../schedule.js'
import { Executor } from './executor.js'

/**
 * This executor executes once with a given delay after it is
 * {@link TimeoutExecutor.start started}.
 *
 * This is a wrapper for {@link  https://developer.mozilla.org/en-US/docs/Web/API/setTimeout `setTimeout`}.
 */
export class TimeoutExecutor extends Executor {
  constructor(delay = 0) {
    super(delay)
  }

  /**
   * @param {World} world
   * @param {Schedule} schedule
   * @param {(error: Error, world: World) => void} [errorHandler]
   */
  start(world, schedule, errorHandler) {
    this.tick = window.setTimeout(() => { schedule.run(world, errorHandler) }, this.time)
  }
  stop() {
    clearTimeout(this.tick)
  }
}
