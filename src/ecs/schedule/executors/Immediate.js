import { World } from '../../registry.js'
import { Schedule } from '../schedule.js'
import { Executor } from './executor.js'

/**
 * This executor immediately executes only once after it is 
 * {@link ImmediateExecutor.start started}.
 */
export class ImmediateExecutor extends Executor {

  /**
   * @param {World} world
   * @param {Schedule} schedule
   */
  start(world, schedule) {
    schedule.run(world)
  }
  stop() {}
}