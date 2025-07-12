import { World } from '../../registry.js'
import { Schedule } from '../schedule.js'
import { Executor } from './executor.js'

/**
 * This executor executes once with a given delay after it is 
 * {@link TimeoutExecutor.start started}.
 * 
 * This is a wrapper for {@link  https://developer.mozilla.org/en-US/docs/Web/API/setTimeout `setTimeout`}.
 */
export class TimeoutExecutor extends Executor {
  constructor(delay = 0){
    super(delay)
  }

  /**
   * @param {World} world
   * @param {Schedule} schedule
   */
  start(world, schedule) {
    this.tick = window.setTimeout(() => { schedule.run(world) }, this.time)
  }
  stop() {
    clearTimeout(this.tick)
  }
}