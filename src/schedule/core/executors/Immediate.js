import { World } from '../../../ecs/index.js'
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
   * @param {(error: Error, world: World) => void} [errorHandler]
   */
  start(world, schedule, errorHandler) {
    schedule.run(world, errorHandler)
  }
  stop() {}
}
