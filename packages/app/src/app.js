/** @import { SystemConfig, SystemGroupConfig } from '@wimaengine/schedule' */
/** @import { Constructor,TypeId } from '@wimaengine/type'*/

import { World, ComponentHooks } from '@wimaengine/ecs'
import { assert } from '@wimaengine/logger'
import { Scheduler, SchedulerBuilder } from '@wimaengine/schedule'
import { typeid } from '@wimaengine/type'

const registererror = 'Systems, plugins or resources should be registered or set before `App().run()`'

export class PluginRegistry {

  /**
   * @type {Plugin[]}
   */
  list = []

  /**
   * @type {Set<TypeId>}
   */
  names = new Set()

  /**
   * @param {Plugin} plugin
   */
  add(plugin) {
    this.list.push(plugin)
    this.names.add(plugin.name())
  }

  /**
   * @param {TypeId} plugin
   */
  hasTypeId(plugin) {
    this.names.has(plugin)
  }

  /**
   * @param {Plugin} plugin
   */
  has(plugin) {
    this.hasTypeId(plugin.name())
  }

  /**
   * @param {App} app
   */
  register(app) {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].register(app)
    }
  }
}
export class App {

  /**
   * @private
   * @type {PluginRegistry}
   */
  plugins = new PluginRegistry()

  /**
   * @private
   * @type {World}
   */
  world = new World()

  /**
   * @private
   * @type {Map<TypeId, unknown>}
   */
  resources = new Map()

  /**
   * @private
   * @type {Scheduler}
   */
  scheduler = new Scheduler()

  /**
   * @private
   * @type {import('@wimaengine/schedule').Runner}
   */
  runner = null

  /**
   * @private
   * @type {boolean}
   */
  initialized = false

  /**
   * Return the world of the app.
   *
   * @returns {World}
   */
  getWorld() {
    return this.world
  }

  /**
   * @param {{label: import('@wimaengine/type').Constructor, delay?: number, repeat?: boolean, errorHandler?: (error: Error, world: World) => void, defaultSystemGroup?: import('@wimaengine/type').Constructor}} config
   */
  createSchedule(config) {
    SchedulerBuilder.Instance.addSchedule(config)

    return this
  }

  /**
   * @param {import('@wimaengine/schedule').Runner} runner
   */
  setRunner(runner) {
    this.runner = runner

    return this
  }

  /**
   * Starts up the {@link App}.
   * Prevents calls to {@link App.registerSystem},
   * {@link App.registerPlugin} and {@link App.setResource}.
   * Flushes any resources staged through {@link App.setResource} into the world before the runner starts.
   *
   * @returns {this}
   */
  run() {
    this.plugins.register(this)
    this.flushResources()

    SchedulerBuilder.Instance.pushToScheduler(this.scheduler)
    assert(this.runner, 'App runner is not set. Call `app.setRunner(...)` before `app.run()`.')
    this.initialized = true
    this.runner(this.scheduler, this.world)

    return this
  }

  /**
   * @param {Plugin} plugin
   */
  registerPlugin(plugin) {
    this.plugins.add(plugin)

    return this
  }

  /**
   * @param {Plugin} debug
   */
  registerDebugger(debug) {
    return this.registerPlugin(debug)
  }

  /**
   * @param {SystemConfig} config
   */
  registerSystem(config) {
    SchedulerBuilder.Instance.add(config)

    return this
  }

  /**
   * @param {SystemGroupConfig} config
   */
  registerSystemGroup(config) {
    SchedulerBuilder.Instance.addGroup(config)

    return this
  }

  /**
   * @template T
   * @param {new (...args:any[])=>T} component
   * @param {ComponentHooks} hooks
   */
  setComponentHooks(component, hooks) {
    this.world.setComponentHooks(component, hooks)

    return this
  }

  /**
   * @template {object} T
   * @param {T} resource
   */
  setResource(resource) {
    assert(!this.initialized, registererror)

    // SAFETY: An object's constructor is constructible.
    const id = typeid(/** @type {Constructor} */(resource.constructor))

    this.setResourceByTypeId(id, resource, world)

    return this
  }

  /**
   * @template T
   * @param {TypeId} id
   * @param {T} resource
   * @param {Constructor | undefined} [world]
   * @returns {this}
   */
  setResourceByTypeId(id, resource, world) {
    assertTrue(!this.initialized, registererror)

    const worldId = world === undefined ? undefined : typeid(world)
    let worldResources = this.resources.get(worldId)

    if (!worldResources) {
      worldResources = new Map()
      this.resources.set(worldId, worldResources)
    }

    worldResources.set(id, resource)

    return this
  }

  /**
   * Stores a resource alias to be applied to every world during `run()`.
   *
   * @template T
   * @param {TypeId} id
   * @param {Constructor<T>} alias
   * @returns {this}
   */
  setResourceAlias(id, alias) {
    assertTrue(!this.initialized, registererror)

    const aliasId = typeid(alias)

    this.resourceAliases.set(aliasId, { id, alias })

    return this
  }

  /**
   * @private
   */
  flushResources() {
    for (const [id, resource] of this.resources) {
      this.world.setResourceByTypeId(id, resource)
    }

    this.resources.clear()
  }
}

export class Plugin {

  /**
   * @param {App} _app
   */
  register(_app) { }

  /**
   * @returns {TypeId}
   */
  name() {

    // SAFETY: `this.constructor` can be casted into a `Contructor`
    return typeid(/** @type {Constructor}*/(this.constructor))
  }
}

/**
 * @abstract
 */
export class PluginGroup extends Plugin {

  /**
   * @private
   * @type {Map<TypeId,Plugin>}
   */
  plugins = new Map()

  /**
   * @template {Plugin} T
   * @param {T} plugin
   * @returns {this}
   */
  add(plugin) {
    this.plugins.set(plugin.name(), plugin)

    return this
  }

  /**
   * @param {TypeId} id
   */
  remove(id) {
    this.plugins.delete(id)

    return this
  }

  /**
   * @template {Plugin} T
   * @param {T} plugin
   */
  replace(plugin) {
    const typeId = plugin.name()

    this
      .remove(typeId)
      .add(plugin)

    return this
  }

  /**
   * @param {App} app
   */
  register(app) {
    for (const plugin of this.plugins.values()) {
      app.registerPlugin(plugin)
    }
  }
}
