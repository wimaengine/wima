import { World } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { Schedule } from './schedule'

/**
 * @template ScheduleType
 * @template {import('@wimaengine/type').Constructor | undefined} SourceWorldType
 * @typedef {{
 *   label: import('@wimaengine/type').Constructor,
 *   repeat?: boolean,
 *   delay?: number,
 *   errorHandler?: (error: Error, world: World) => void,
 *   defaultSystemGroup?: import('@wimaengine/type').Constructor,
 *   world: import('@wimaengine/type').Constructor,
 *   sourceWorld: SourceWorldType,
 *   schedule: ScheduleType
 * }} ExecutableConfig
 */

/**
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
 * @template ScheduleType
 * @template {import('@wimaengine/type').Constructor | undefined} SourceWorldType
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
   * @type {ScheduleType}
   */
  schedule

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
   * @type {SourceWorldType}
   */
  sourceWorld

  /**
   * @readonly
   * @type {((error: Error, world: World) => void) | undefined}
   */
  errorHandler

  /**
   * @param {ExecutableConfig<ScheduleType, SourceWorldType>} config
   */
  constructor(config) {
    this.label = config.label
    this.repeat = config.repeat ?? true
    this.delay = config.delay ?? 0
    this.errorHandler = config.errorHandler
    this.defaultSystemGroup = config.defaultSystemGroup
    this.world = config.world
    this.sourceWorld = config.sourceWorld
    this.schedule = /** @type {ScheduleType} */ (config.schedule ?? new Schedule())
  }

  /**
   * @returns {string}
   */
  get typeId() {
    return typeid(this.label)
  }
}
