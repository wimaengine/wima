import { World } from '../registry.js'
import { Executor } from './executors/index.js'
import { Schedule } from './schedule.js'

/**
 * This is the binding between an {@link Executor executor} and a
 * {@link Schedule schedule}.
 * 
 * @example
 * ```ts
 * class SomeExecutor extends Executor {
 *   start(world:World, schedule:Schedule){
 *     schedule.run(world,schedule)
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
   * @param {Schedule} schedule
   * @param {Executor} executor
   */
  constructor(schedule, executor) {
    this.schedule = schedule
    this.executor = executor
  }

  /**
   * @param {World} world
   */
  start(world) {
    this.executor.start(world, this.schedule)
  }
  stop() {
    this, this.executor.stop()
  }

  /**
   * @returns {Schedule}
   */
  getSchedule() {
    return this.schedule
  }
}