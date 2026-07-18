/** @import { CrossWorldSchedule } from './crossworldschedule' */
/** @import { Schedule } from './schedule' */
/** @import { Constructor } from '@wimaengine/type' */
import { typeid } from '@wimaengine/type'
import { Executable } from './executable'

/**
 * Stores labeled {@link Executable executables}.
 *
 * @example
 * ```ts
 * class PrimarySchedule {}
 * class SecondarySchedule {}
 * class MainWorld {}
 *
 * scheduler.set(new Executable({ label: PrimarySchedule, world: MainWorld }))
 * scheduler.set(new Executable({ label: SecondarySchedule, world: MainWorld }))
 *
 * const primarySchedule = scheduler.get(PrimarySchedule)
 * ```
 */
export class Scheduler {

  /**
   * @type {Map<string, Executable<Schedule, undefined>>}
   */
  executables = new Map()

  /**
   * @type {Map<string, Executable<CrossWorldSchedule, Constructor>>}
   */
  crossWorldExecutables = new Map()

  /**
   * @param {Executable<Schedule, undefined>} executable
   */
  set(executable) {
    this.executables.set(typeid(executable.label), executable)
  }

  /**
   * @param {Executable<CrossWorldSchedule, Constructor>} executable
   */
  setCrossWorld(executable) {
    this.crossWorldExecutables.set(typeid(executable.label), executable)
  }

  /**
   * @param {import('@wimaengine/type').Constructor} label
   * @returns {Schedule | undefined}
   */
  get(label) {
    return this.executables.get(typeid(label))?.schedule
  }

  /**
   * @param {import('@wimaengine/type').Constructor} label
   * @returns {CrossWorldSchedule | undefined}
   */
  getCrossWorld(label) {
    return this.crossWorldExecutables.get(typeid(label))?.schedule
  }

  /**
   * @returns {IterableIterator<Executable<Schedule, undefined>>}
   */
  values() {
    return this.executables.values()
  }

  /**
   * @returns {IterableIterator<Executable<CrossWorldSchedule, Constructor>>}
   */
  crossWorldValues() {
    return this.crossWorldExecutables.values()
  }
}
