/** @import { ChaosPlugin } from './typedef/index.js' */
/** @import { SystemFunc } from '../ecs/index.js' */
import { World, Scheduler, Executor, ComponentHooks, RAFExecutor, ImmediateExecutor } from '../ecs/index.js'
import { EventDispatch } from '../event/index.js'
import { assert } from '../logger/index.js'
import { AppSchedule } from './schedules.js'

const registererror = 'Systems, plugins or resources should be registered or set before `App().run()`'

export class App {

  /**
   * @private
   * @type {World}
   */
  world = new World()

  /**
   * @private
   * @type {Scheduler}
   */
  scheduler = new Scheduler()

  /**
   * @private
   * @type {boolean}
   */
  initialized = false

  constructor() {
    this.createSchedule(
      AppSchedule.Startup,
      new ImmediateExecutor()
    )
    this.createSchedule(
      AppSchedule.Update,
      new RAFExecutor()
    )
  }

  /**
   * Return the world of the app.
   * 
   * @returns {World}
   */
  getWorld(){
    return this.world
  }

  /**
   * @template {Executor} T
   * @param {string} label
   * @param {T} executor
   */
  createSchedule(label, executor) {
    return this.scheduler.set(label, executor)
  }

  /**
   * Starts up the {@link App}.
   * Prevents calls to {@link App.registerSystem},
   * {@link App.registerPlugin} and {@link App.setResource}.
   * 
   * @returns {this}
   */
  run() {
    this.initialized = true
    this.scheduler.run(this.world)

    return this
  }

  /**
   * @param {ChaosPlugin} plugin
   */
  registerPlugin(plugin) {
    plugin.register(this)

    return this
  }

  /**
   * @param {ChaosPlugin} debug
   */
  registerDebugger(debug) {
    return this.registerPlugin(debug)
  }

  /**
   * @param {string} label
   * @param {SystemFunc} system
   */
  registerSystem(label, system) {
    const schedule = this.scheduler.get(label)

    assert(!this.initialized, registererror)
    assert(schedule, `The system ${system.name} cannot be added to schedule "${label}" as the schedule doesn't exist.`)

    schedule.add(system)

    return this
  }

  /**
   * @param {Function} type
   */
  registerType(type) {
    this.world.registerType(type)

    return this
  }

  /**
   * @template {Function} T
   * @param {T} event
   */
  registerEvent(event) {
    const name = `events<${event.name.toLowerCase()}>`

    this
      .registerType(event)
      .registerSystem(AppSchedule.Update, makeEventClear(name))
      .world.setResourceByName(name, new EventDispatch())

      return this
  }

  /**
   * @param {Function} component
   * @param {ComponentHooks} hooks
   */
  setComponentHooks(component, hooks) {
    this.world.setComponentHooks(component.name.toLowerCase(), hooks)

    return this
  }

  /**
   * @template {object} T
   * @param {T} resource
   */
  setResource(resource) {
    assert(!this.initialized, registererror)
    this.world.setResource(resource)

    return this
  }
}

/**
 * @param {string} name 
 * @returns {SystemFunc}
 */
function makeEventClear(name) {
  return function clearEvents(world) {
    const dispatch = world.getResource(name)

    dispatch.clear()
  }
}