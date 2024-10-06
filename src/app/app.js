/** @import { ChaosPlugin } from './typedef/index.js' */
/** @import { SystemFunc } from '../ecs/index.js' */
/** @import { HandleProvider, Parser } from '../asset/index.js' */
import { World, Scheduler, Executor, ComponentHooks, RAFExecutor, ImmediateExecutor } from '../ecs/index.js'
import { EventDispatch } from '../event/index.js'
import { assert } from '../logger/index.js'
import { AppSchedule } from './schedules.js'
import { Assets, generateParserSystem } from '../asset/index.js'
import { SchedulerBuilder, SystemConfig } from './core/index.js'

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

  /**
   * @private
   * @type {SystemConfig[]}
   */
  systemsevents = []

  /**
   * @private
   * @type {SchedulerBuilder}
   */
  systemBuilder = new SchedulerBuilder()

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
  getWorld() {
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
    this.systemBuilder.add(new SystemConfig(system, label))

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
   * @template T
   * @param {Function} asset
   * @param {HandleProvider<T>} [handleprovider]
   */
  registerAsset(asset, handleprovider) {
    const name = asset.name.toLowerCase()

    // @ts-ignore
    // ill deal with this later
    this.world.setResourceByName(`assets<${name}>`, new Assets(asset.default, handleprovider))

    return this
  }

  /**
   * @template T
   * @param {Function} asset 
   * @param {Parser<T>} parser 
   */
  registerAssetParser(asset, parser) {
    const name = asset.name.toLowerCase()

    this
      .registerSystem(AppSchedule.Update, generateParserSystem(name))
      .world.setResourceByName(`parser<${name}>`, parser)

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
    this
      .registerType(resource.constructor)
      .world.setResource(resource)

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