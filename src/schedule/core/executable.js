import { World } from '../../ecs/index.js'
import { typeid } from '../../type/index.js'
import { Schedule } from './schedule.js'

/**
 * This is the binding between a labeled {@link Schedule schedule}
 * and its runtime configuration.
 *
 * @example
 * ```ts
 * function helloWorld(){
 *   console.log("hello world")
 * }
 *
 * const world = new World()
 * const scheduler = new Scheduler()
 * const runner = defaultRunner
 * const executable = new Executable({ label: "startup", repeat: false })
 *
 * scheduler.set(executable)
 * scheduler.get("startup").add(helloWorld)
 *
 * //Runs the schedule with the given config
 * //outputs "hello world" to the console.
 * runner.run(scheduler, world)
 * ```
 */
export class Executable {

  /**
   * @readonly
   * @type {import('../../type/index.js').Constructor}
   */
  label

  /**
   * @readonly
   * @type {Schedule}
   */
  schedule = new Schedule()

  /**
   * @readonly
   * @type {boolean}
   */
  repeat

  /**
   * @readonly
   * @type {number}
   */
  delay

  /**
   * @readonly
   * @type {import('../../type/index.js').Constructor | undefined}
   */
  defaultSystemGroup

  /**
   * @readonly
   * @type {((error: Error, world: World) => void) | undefined}
   */
  errorHandler

  /**
   * @param {{label: import('../../type/index.js').Constructor, repeat?: boolean, delay?: number, errorHandler?: (error: Error, world: World) => void, defaultSystemGroup?: import('../../type/index.js').Constructor}} config
   */
  constructor(config) {
    this.label = config.label
    this.repeat = config.repeat ?? true
    this.delay = config.delay ?? 0
    this.errorHandler = config.errorHandler
    this.defaultSystemGroup = config.defaultSystemGroup
  }

  /**
   * @returns {string}
   */
  get typeId() {
    return typeid(this.label)
  }
}
