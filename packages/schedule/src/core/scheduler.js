import { typeid } from '@wimaengine/type'
import { Executable } from './executable'
import { Schedule } from './schedule'

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
   * @type {Map<string,Executable>}
   */
  executables = new Map()

  /**
   * @param {Executable} executable
   */
  set(executable) {
    this.executables.set(typeid(executable.label), executable)
  }

  /**
   * @param {import('@wimaengine/type').Constructor} label
   * @returns {Schedule | undefined}
   */
  get(label) {
    return this.executables.get(typeid(label))?.schedule
  }

  /**
   * @returns {IterableIterator<Executable>}
   */
  values() {
    return this.executables.values()
  }
}
