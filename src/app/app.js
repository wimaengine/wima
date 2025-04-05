/** @import { ChaosPlugin } from './typedef/index.js' */
/** @import { SystemFunc } from '../ecs/index.js' */
/** @import { HandleProvider, Parser } from '../asset/index.js' */
import { World, Scheduler, Executor, ComponentHooks, RAFExecutor, ImmediateExecutor } from '../ecs/index.js'
import { EventPlugin } from '../event/index.js'
import { assert,deprecate } from '../logger/index.js'
import { AppSchedule } from './schedules.js'
import { SchedulerBuilder, SystemConfig } from './core/index.js'
import { AssetParserPlugin,AssetPlugin } from '../asset/plugins/index.js'

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
   * This will be removed in future revisions
   * with no prior notice after system ordering is
   * added
   * 
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

    for (let i = 0; i < this.systemsevents.length; i++) {
      const ev = this.systemsevents[i]

      this.systemBuilder.add(ev)
    }

    this.systemsevents = []

    this.systemBuilder.pushToScheduler(this.scheduler)
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
   * @deprecated
   * @template {Function} T
   * @param {T} event
   */
  registerEvent(event) {
    deprecate('App.registerEvent()', 'EventPlugin')
    this.registerPlugin(
      new EventPlugin({ event })
    )

    return this
  }

  /**
   * @deprecated
   * @template T
   * @param {Function} asset
   * @param {HandleProvider<T>} [handleprovider]
   */
  registerAsset(asset, handleprovider) {
    this.registerPlugin(new AssetPlugin({

      // this function will be removed so the cast does not 
      // matter much
      // eslint-disable-next-line object-shorthand
      asset:/** @type {any}*/(asset),
      handleprovider
    }))

    return this
  }

  /**
   * @deprecated
   * @template T
   * @param {Function} asset 
   * @param {Parser<T>} parser 
   */
  registerAssetParser(asset, parser) {
    const name = asset.name.toLowerCase()

    this
      .registerPlugin(new AssetParserPlugin({
        
      // this function will be removed so the cast does not 
      // matter much
      // eslint-disable-next-line object-shorthand
      asset:/** @type {any}*/(asset),
      parser
      }))

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