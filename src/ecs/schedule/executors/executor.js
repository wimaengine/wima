import { World } from '../../registry.js'
import { Schedule } from '../schedule.js'

/**
 * Classes which implement/extend {@link Executor `Executor`} takes a 
 * {@link Schedule schedule} and executes the systems on it
 * using a {@link World world}.
 * 
 * @see {@link ImmediateExecutor}
 * @see {@link TimeoutExecutor}
 * @see {@link IntervalExecutor}
 * @see {@link RAFExecutor}
 * 
 * @example
 * ```ts
 * class SomeExecutor extends Executor {}
 * 
 * const world = new World()
 * const schedule = new Schedule()
 * const executor = new SomeExecutor()
 * 
 * executor.start(world, schedule)
 * ```
 */
export class Executor {

  /**
   * @type {number}
   */
  tick = 0

  /**
   * @type {number}
   */
  time = 0

  /**
   * @param {number} time
   */
  constructor(time = 0) {
    this.time = time
  }

  /**
   * @param {World} _world
   * @param {Schedule} _schedule
   */
  start(_world, _schedule) { }
  stop() { }
}