import { Executor } from './executor.js'
import { World } from '../../registry.js'
import { Schedule } from '../schedule.js'

/**
 * This executor executes every given duration after it is 
 * {@link IntervalExecutor.start started}.
 * 
 * This is a wrapper for {@link  https://developer.mozilla.org/en-US/docs/Web/API/setInterval `setInterval`}.
 */
export class IntervalExecutor extends Executor {

  /**
   * @param {number} duration 
   */
  constructor(duration = 0){
    super(duration)
  }

  /**
   * @param {World} world
   * @param {Schedule} schedule
   */
  start(world, schedule) {
    this.tick = setInterval(() => { schedule.run(world) }, this.time)[Symbol.toPrimitive]()
  }
  stop() {
    clearInterval(this.tick)
  }
}