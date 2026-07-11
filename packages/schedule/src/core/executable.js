import { World } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { Schedule } from './schedule'

/**
 * @typedef {{
 *   label: import('@wimaengine/type').Constructor,
 *   repeat?: boolean,
 *   delay?: number,
 *   errorHandler?: (error: Error, world: World) => void,
 *   defaultSystemGroup?: import('@wimaengine/type').Constructor,
 *   world: import('@wimaengine/type').Constructor
 * }} ExecutableConfig
 *
 * @typedef {{
 *   label: import('@wimaengine/type').Constructor,
 *   repeat?: boolean,
 *   delay?: number,
 *   errorHandler?: (error: Error, world: World) => void,
 *   defaultSystemGroup?: import('@wimaengine/type').Constructor,
 *   world?: import('@wimaengine/type').Constructor
 * }} ScheduleConfig
 */

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
 * class Startup {}
 * class MainWorld {}
 *
 * const world = new World()
 * const scheduler = new Scheduler()
 * const executable = new Executable({ label: Startup, repeat: false, world: MainWorld })
 * const worlds = new Map([[typeid(MainWorld), world]])
 *
 * scheduler.set(executable)
 * scheduler.get(Startup).add(helloWorld)
 *
 * //Runs the schedule with the given config
 * runner(scheduler, worlds)
 * ```
 */
export class Executable {

  /**
   * @readonly
   * @type {import('@wimaengine/type').Constructor}
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
   * @type {import('@wimaengine/type').Constructor | undefined}
   */
  defaultSystemGroup

  /**
   * @readonly
   * @type {import('@wimaengine/type').Constructor}
   */
  world

  /**
   * @readonly
   * @type {((error: Error, world: World) => void) | undefined}
   */
  errorHandler

  /**
   * @param {ExecutableConfig} config
   */
  constructor(config) {
    this.label = config.label
    this.repeat = config.repeat ?? true
    this.delay = config.delay ?? 0
    this.errorHandler = config.errorHandler
    this.defaultSystemGroup = config.defaultSystemGroup
    this.world = config.world
  }

  /**
   * @returns {string}
   */
  get typeId() {
    return typeid(this.label)
  }
}
