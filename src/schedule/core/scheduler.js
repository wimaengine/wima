import { Executable } from './executable.js'
import { Schedule } from './schedule.js'

/**
 * Stores labeled {@link Executable executables}.
 *
 * @example
 * ```ts
 * scheduler.set(new Executable({ label: "primary" }))
 * scheduler.set(new Executable({ label: "secondary" }))
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
   * @param {Executable} executable
   */
  set(executable) {
    this.executables.set(executable.label, executable)
  }

  /**
   * @param {string} label
   * @returns {Schedule | undefined}
   */
  get(label) {
    return this.executables.get(label)?.schedule
  }

  /**
   * @returns {IterableIterator<Executable>}
   */
  values() {
    return this.executables.values()
  }
}
