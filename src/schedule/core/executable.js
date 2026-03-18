import { World } from '../../ecs/index.js'
import { Executor } from './executors/index.js'
import { Schedule } from './schedule.js'

/**
 * This is the binding between an {@link Executor executor} and a
 * {@link Schedule schedule}.
 *
 * @example
 * ```ts
 * class SomeExecutor extends Executor {
 *   start(world:World, schedule:Schedule, errorHandler){
 *     schedule.run(world, errorHandler)
 *   }
 * }
 *
 * function helloWorld(){
 *   console.log("hello world")
 * }
 *
 * const world = new World()
 * const schedule = new Schedule()
 * const executor = new Executor()
 * const executable = new Executable(schedule, executor)
 *
 * //Runs the schedule with the given executor
 * //outputs "hello world" to the console.
 * executable.start()
 * ```
 */
export class Executable {

  /**
   * @private
   * @type {Executor}
   */
  executor

  /**
   * @private
   * @type {Schedule}
   */
  schedule
  /**
   * @private
   * @type {((error: Error, world: World) => void) | undefined}
   */
  errorHandler

  /**
   * @param {Schedule} schedule
   * @param {Executor} executor
   * @param {(error: Error, world: World) => void} [errorHandler]
   */
  constructor(schedule, executor, errorHandler) {
    this.schedule = schedule
    this.executor = executor
    this.errorHandler = errorHandler
  }

  /**
   * @param {World} world
   */
  start(world) {
    this.executor.start(world, this.schedule, this.errorHandler)
  }
  stop() {
    this.executor.stop()
  }

  /**
   * @returns {Schedule}
   */
  getSchedule() {
    return this.schedule
  }
}
