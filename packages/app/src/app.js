/** @import { CrossWorldScheduleConfig, CrossWorldSystemConfig, ScheduleConfig, SystemConfig, SystemGroupConfig } from '@wimaengine/schedule' */
/** @import { Constructor,TypeId } from '@wimaengine/type'*/

import { World, ComponentHooks } from '@wimaengine/ecs'
import { assert, assertTrue } from '@wimaengine/logger'
import { Scheduler, SchedulerBuilder } from '@wimaengine/schedule'
import { typeid } from '@wimaengine/type'
import { Worlds } from './worlds'

const registererror = 'Schedules, crossworld schedules, system groups, systems, crossworld systems, plugins, worlds, resource aliases or resources should be registered or set before `App().run()`'

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
   * @param {TypeId} pluginId
   */
  hasTypeId(pluginId) {
    return this.names.has(pluginId)
  }

  /**
   * @param {TypeId} pluginId
   */
  has(pluginId) {
    return this.hasTypeId(pluginId)
  }

  /**
   * @param {App} app
   */
  register(app) {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].register(app)
    }
  }

  /**
   * Validates that registered plugins only require plugins that already exist.
   *
   * @param {App} app
   */
  assertDependencies(app) {
    for (let i = 0; i < this.list.length; i++) {
      const plugin = this.list[i]
      const pluginId = plugin.name()
      const requires = plugin.requires()

      for (let j = 0; j < requires.length; j++) {
        const requiredId = requires[j]

        assertTrue(
          app.hasPlugin(requiredId),
          `The plugin \`${pluginId}\` requires \`${requiredId}\`, but it is not registered.`
        )
      }
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
   * @type {Map<TypeId, { component: Constructor, hooks: ComponentHooks }>}
   */
  componentHooks = new Map()

  /**
   * @private
   * @type {Map<TypeId, { id: TypeId, alias: Constructor }>}
   */
  resourceAliases = new Map()

  /**
   * @private
   * @type {Map<TypeId | undefined, Map<TypeId, unknown>>}
   */
  resources = new Map()

  /**
   * @private
   * @type {Worlds}
   */
  worlds = new Worlds()

  /**
   * @private
   * @type {Constructor | undefined}
   */
  defaultWorldLabel = undefined

  /**
   * @private
   * @type {Scheduler}
   */
  scheduler = new Scheduler()

  /**
   * @private
   * @type {import('@wimaengine/schedule').Runner | undefined}
   */
  runner = undefined

  /**
   * @private
   * @type {boolean}
   */
  initialized = false

  /**
   * Return the default world of the app or a world by label.
   *
   * @param {Constructor | undefined} [label]
   * @returns {World}
   */
  getWorld(label) {
    return this.worlds.getWorld(label)
  }

  /**
   * Checks whether a plugin has been registered.
   *
   * @param {TypeId} pluginId
   * @returns {boolean}
   */
  hasPlugin(pluginId) {
    return this.plugins.hasTypeId(pluginId)
  }

  /**
   * Creates a world by label.
   *
   * @param {Constructor} label
   * @returns {this}
   */
  setWorld(label) {
    assertTrue(!this.initialized, registererror)

    const worldId = typeid(label)
    const world = this.worlds.get(worldId)

    if (world) {
      return this
    }

    const newWorld = new World()

    this.worlds.set(worldId, newWorld)

    return this
  }

  /**
   * Switches the default world label to an already-created world.
   *
   * @param {Constructor} label
   * @returns {this}
   */
  defaultWorld(label) {
    assertTrue(!this.initialized, registererror)
    this.worlds.defaultWorldId = typeid(label)
    this.defaultWorldLabel = label

    return this
  }

  /**
   * @param {ScheduleConfig} config
   */
  createSchedule(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.addSchedule(config)

    return this
  }

  /**
   * @param {CrossWorldScheduleConfig} config
   */
  registerCrossWorldSchedule(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.addCrossWorldSchedule(config)

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
   * {@link App.registerSystemGroup}, {@link App.registerPlugin},
   * {@link App.createSchedule}, {@link App.setWorld},
   * {@link App.defaultWorld}, {@link App.setComponentHooks},
   * {@link App.setResourceAlias},
   * {@link App.setResource} and {@link App.setResourceByTypeId}.
   * Applies queued resource aliases to every world before the runner starts.
   * Applies queued component hooks to every world before the runner starts.
   * Flushes any resources staged through {@link App.setResource} into their target worlds before the runner starts.
   *
   * @returns {this}
   */
  run() {
    this.plugins.register(this)
    this.plugins.assertDependencies(this)
    this.applyComponentHooks()
    this.applyResourceAliases()
    this.flushResources()

    SchedulerBuilder.Instance.pushToScheduler(this.scheduler, this.defaultWorldLabel)
    assert(this.runner, 'App runner is not set. Call `app.setRunner(...)` before `app.run()`.')
    this.initialized = true
    this.runner(this.scheduler, this.worlds)

    return this
  }

  /**
   * @param {Plugin} plugin
   */
  registerPlugin(plugin) {
    assertTrue(!this.initialized, registererror)

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
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.add(config)

    return this
  }

  /**
   * @param {CrossWorldSystemConfig} config
   */
  registerCrossworldSystem(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.addCrossworldSystem(config)

    return this
  }

  /**
   * @param {SystemGroupConfig} config
   */
  registerSystemGroup(config) {
    assertTrue(!this.initialized, registererror)

    SchedulerBuilder.Instance.addGroup(config)

    return this
  }

  /**
   * @template T
   * @param {new (...args:any[])=>T} component
   * @param {ComponentHooks} hooks
   */
  setComponentHooks(component, hooks) {
    assertTrue(!this.initialized, registererror)

    const id = typeid(component)

    this.componentHooks.set(id, { component, hooks })

    return this
  }

  /**
   * @template {object} T
   * @param {T} resource
   * @param {Constructor | undefined} [world]
   */
  setResource(resource, world) {
    assertTrue(!this.initialized, registererror)

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
    for (const [worldId, resources] of this.resources) {
      const world = worldId === undefined ?
        this.worlds.getWorld() :
        this.worlds.get(worldId)

      assert(world, `The world "${worldId}" is not set.`)

      for (const [id, resource] of resources) {
        world.setResourceByTypeId(id, resource)
      }
    }

    this.resources.clear()
  }

  /**
   * @private
   */
  applyComponentHooks() {
    for (const hooks of this.componentHooks.values()) {
      for (const world of this.worlds.values()) {
        world.setComponentHooks(hooks.component, hooks.hooks)
      }
    }

    this.componentHooks.clear()
  }

  /**
   * @private
   */
  applyResourceAliases() {
    for (const world of this.worlds.values()) {
      for (const alias of this.resourceAliases.values()) {
        world.setResourceAlias(alias.id, alias.alias)
      }
    }

    this.resourceAliases.clear()
  }
}

export class Plugin {

  /**
   * @param {App} _app
   */
  register(_app) { }

  /**
   * Returns the type ids of plugins required by this plugin.
   *
   * @returns {TypeId[]}
   */
  requires() {
    return []
  }

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
