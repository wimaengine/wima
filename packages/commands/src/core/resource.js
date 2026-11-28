/** @import { Constructor, TypeId } from '@wimaengine/type' */
/** @import { World } from '@wimaengine/ecs' */
import { CommandQueue } from '@wimaengine/command'
import { typeid } from '@wimaengine/type'
import { AddResourceCommand, RemoveResourceCommand, SetResourceAliasCommand, SetResourceCommand } from '../commands'

/**
 * Builds resource changes for deferred application to a world.
 *
 * `add()`, `remove()`, and `setAlias()` append changes to the world's deferred
 * queue in call order and return this builder for chaining. The world applies
 * those changes later.
 *
 * @example
 * ```js
 * import { ResourceCommands } from '@wimaengine/commands'
 * import { typeid } from '@wimaengine/type'
 *
 * class Settings {}
 * class SettingsAlias {}
 *
 * // `world` must already support deferred resource changes.
 * const commands = new ResourceCommands(world)
 * commands
 *   .add(new Settings())
 *   .setAlias(typeid(Settings), SettingsAlias)
 * ```
 */
export class ResourceCommands {

  /**
   * World's deferred resource queue used by this builder.
   *
   * @private
   * @type {CommandQueue}
   */
  buffer

  /**
   * Creates a resource-command builder for a world.
   *
   * The builder uses the world's existing deferred queue; it does not create
   * one. The world must support deferred resource changes before this call.
   *
   * @param {World} world - World whose resource changes will be queued.
   */
  constructor(world) {
    this.buffer = world.getResource(CommandQueue)
  }

  /**
   * Queues a resource to be installed in the world.
   *
   * When the change is applied, a resource with the same type replaces the
   * existing value.
   *
   * @param {object} resource - Resource instance to install.
   * @returns {this} This builder.
   */
  add(resource) {
    this.buffer.add(new AddResourceCommand(resource))

    return this
  }

  /**
   * Sets a resource or one value inside an existing resource.
   *
   * An empty path replaces the resource. Non-empty paths address nested live
   * values, for example `['enabled']` or `['display', 'theme']`.
   *
   * @param {Constructor} resourceType
   * @param {unknown} value
   * @param {(number|string)[]} [path=[]]
   * @returns {this}
   */
  set(resourceType, value, path = []) {
    return this.setByTypeId(typeid(resourceType), value, path)
  }

  /**
   * Sets a resource or one value inside an existing resource by type ID.
   *
   * An empty path replaces the resource. Non-empty paths address nested live
   * values.
   *
   * @param {TypeId} resourceType
   * @param {unknown} value
   * @param {(number|string)[]} [path=[]]
   * @returns {this}
   */
  setByTypeId(resourceType, value, path = []) {
    this.buffer.add(new SetResourceCommand(resourceType, value, path))

    return this
  }

  /**
   * Queues removal of a resource by its constructor.
   *
   * When the change is applied, the resource is removed. An alias registered
   * under the same constructor is removed as well; aliases registered under
   * other constructors remain.
   *
   * @param {Constructor} resourceType - Constructor of the resource to remove.
   * @returns {this} This builder.
   */
  remove(resourceType) {
    this.buffer.add(new RemoveResourceCommand(resourceType))

    return this
  }

  /**
   * Queues an alias for a resource type ID.
   *
   * Once applied, lookups through `alias` resolve to the resource identified by
   * `id`. The alias may be queued before that resource is added, and a later
   * alias for the same constructor replaces its target.
   *
   * @param {TypeId} id - Type ID of the resource the alias names.
   * @param {Constructor} alias - Constructor used to look up the resource.
   * @returns {this} This builder.
   */
  setAlias(id, alias) {
    this.buffer.add(new SetResourceAliasCommand(id, alias))

    return this
  }
}
