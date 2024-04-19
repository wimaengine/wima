import { World } from '../registry.js'
import { Executable } from './executable.js'
import { Executor } from './executors/index.js'
import { Schedule } from './schedule.js'

/**
 * Stores labeled {@link Schedule schedules} which are
 * bound to a given {@link Executor executor}.
 * 
 * @example
 * ```ts
 * class SomeExecutor extends Executor {}
 * 
 * scheduler.set("primary",new SomeExecutor())
 * scheduler.set("secondary",new SomeExecutor())
 * 
 * const primarySchedule = scheduler.get("primary")
 * ```
 */
export class Scheduler {

  /**
   * @type {Map<string,Executable>}
   */
  executables = new Map()

  /**
   * @param {string} label
   * @param {Executor} executor
   */
  set(label, executor) {
    const schedule = new Schedule()

    this.executables.set(label, new Executable(schedule, executor))
  }

  /**
   * @param {string} label
   * @returns {Schedule | undefined}
   */
  get(label) {
    return this.executables.get(label)?.getSchedule()
  }

  /**
   * @param {World} world
   */
  run(world) {
    const executables = this.executables.values()

    for (const executable of executables) {
      executable.start(world)
    }
  }
  stop() {
    const executables = this.executables.values()

    for (const executable of executables) {
      executable.stop()
    }
  }
}