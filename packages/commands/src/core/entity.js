/** @import { EntityHandle, World } from '@wimaengine/ecs' */
/** @import { TupleConstructor } from '@wimaengine/type' */
import { CommandQueue } from '@wimaengine/command'
import { assert } from '@wimaengine/logger'
import { CloneCommand, SpawnCommand, DespawnCommand, RemoveCommand, ReparentCommand, SetComponentCommand } from '../commands'

const entityerror = 'Spawn an entity using `Entity.spawn()` before using '

/**
 * Builds entity changes for deferred application to a world.
 *
 * Start an operation with `EntityCommands.entity()` to select an existing
 * entity or with `EntityCommands.spawn()` to allocate one. Add components with
 * `EntityCommands.insert()` or `EntityCommands.insertPrefab()`, then call
 * `EntityCommands.build()` to add the buffered insertion to the world's
 * deferred queue. The world applies the queued change later. `spawn()` returns
 * a handle immediately, before its components are inserted.
 *
 * Calling `entity()` or `spawn()` starts a new buffered operation and replaces
 * any unfinished operation. `clone()`, `remove()`, `despawn()`, and `reparent()`
 * add their changes to the deferred queue immediately.
 *
 * @example
 * ```js
 * import { EntityCommands } from '@wimaengine/commands'
 * import { Position2D } from '@wimaengine/transform'
 *
 * class Selectable {}
 *
 * // `world` must already support deferred entity changes.
 * const commands = new EntityCommands(world)
 * const entity = commands
 *   .spawn()
 *   .insert(new Position2D())
 *   .build()
 *
 * commands.entity(entity).insert(new Selectable()).build()
 * // The world applies the queued changes later.
 * ```
 */
export class EntityCommands {

  /**
   * Creates an entity-command builder for a world.
   *
   * The builder uses the world's existing deferred queue; it does not create
   * one. The world must support deferred entity changes before this call.
   *
   * @private
   * @type {CommandQueue}
   */
  queue

  /**
   * @private
   * @type {SpawnCommand | null}
   */
  buffered = null

  /**
   * @param {World} world
   */
  constructor(world) {
    this.queue = world.getResource(CommandQueue)
    this.world = world
  }

  /**
   * Selects an existing entity for a buffered component insertion.
   *
   * This stores the handle without changing the entity and replaces any
   * unfinished buffered operation. Call `insert()` or `insertPrefab()`, then
   * `build()` to queue the insertion.
   *
   * @param {EntityHandle} entity - Existing entity to target.
   * @returns {this} This builder.
   */
  entity(entity) {
    this.buffered = new SpawnCommand(entity)

    return this
  }

  /**
   * Allocates an empty entity immediately and starts buffering components for
   * it.
   *
   * Components are not inserted until `build()` queues the operation and the
   * world applies it. Calling this again replaces an unfinished buffered
   * operation; a handle allocated by the previous call remains allocated but
   * is no longer buffered.
   *
   * @returns {this} This builder.
   */
  spawn() {
    const entity = this.world.spawn([])

    this.buffered = new SpawnCommand(entity)

    return this
  }

  /**
   * Spawns one entity for each component tuple in `batch`.
   *
   * For each tuple, this calls `spawn()`, appends the tuple with
   * `insertPrefab()`, and calls `build()`. Handles are allocated immediately;
   * their component insertions are queued in batch order and applied later.
   * An empty batch returns an empty array and leaves the current buffered
   * operation unchanged.
   *
   * @template {unknown[]} T
   * @param {[...T][]} batch - Component tuples for the new entities.
   * @returns {EntityHandle[]} The newly allocated handles in batch order.
   */
  spawnBatch(batch) {
    const entities = []

    for (let i = 0; i < batch.length; i++) {
      const entity = this
        .spawn()
        .insertPrefab(batch[i])
        .build()

      entities.push(entity)
    }

    return entities
  }

  /**
   * Queues the current buffered entity insertion.
   *
   * The insertion is added to the world's deferred queue, then the buffered
   * operation is cleared and its entity handle is returned. Calling this method
   * without first calling `entity()` or `spawn()` throws an assertion error.
   *
   * @returns {EntityHandle} The allocated or selected entity handle.
   */
  build() {
    assert(this.buffered, `${entityerror}\`EntityCommands.build()\`.`)

    const { entity } = this.buffered

    this.queue.add(this.buffered)
    this.buffered = null

    return entity
  }

  /**
   * Adds one component to the current buffered entity insertion.
   *
   * This does not queue or apply a change by itself. It must follow `entity()`
   * or `spawn()` and be followed by `build()`. Without a buffered operation,
   * the method throws an assertion error.
   *
   * @template T
   * @param {T} component - Component instance to add.
   * @returns {this} This builder.
   */
  insert(component) {
    assert(this.buffered, `${entityerror}\`EntityCommands.insert()\`.`)
    this.buffered.insert(component)

    return this
  }

  /**
   * Sets a component or one value inside an existing component.
   *
   * An empty path replaces the component. Non-empty paths address nested live
   * values, for example `['x']` or `['transform', 'position', 'x']`.
   *
   * @param {import('@wimaengine/type').Constructor} componentType
   * @param {unknown} value
   * @param {(number|string)[]} [path=[]]
   * @returns {this}
   */
  set(componentType, value, path = []) {
    assert(this.buffered, `${entityerror}\`EntityCommands.set()\`.`)
    this.queue.add(new SetComponentCommand(this.buffered.entity, componentType, value, path))
    this.buffered = null

    return this
  }

  /**
   * Adds all components in a tuple to the current buffered entity insertion.
   *
   * This is equivalent to calling `insert()` for each value, preserving tuple
   * order. It does not queue or apply the change until `build()` is called.
   *
   * @template {unknown[]} T
   * @param {[...T]} components - Component instances to add in order.
   * @returns {this} This builder.
   */
  insertPrefab(components) {
    assert(this.buffered, `${entityerror}\`EntityCommands.insertPrefab()\`.`)

    this.buffered.insertPrefab(components)

    return this
  }

  /**
   * Queues a clone of an entity and its descendants.
   *
   * Clone handles are allocated immediately, while component insertion is
   * deferred. Components with registered clone behavior are copied, and
   * hierarchy references are remapped for the clone. The source entity must
   * exist.
   *
   * @param {EntityHandle} entity - Root entity to clone.
   * @returns {EntityHandle} The cloned root entity handle.
   */
  clone(entity) {
    const command = CloneCommand.create(this.world, entity)

    this.queue.add(command)

    return command.entity
  }

  /**
   * Queues removal of component types from an entity.
   *
   * The component constructors are used when the deferred change is applied. A
   * stale entity handle has no effect.
   *
   * @template {unknown[]} T
   * @param {EntityHandle} entity - Entity whose components will be removed.
   * @param {TupleConstructor<T>} components - Component constructors to remove.
   * @returns {void}
   */
  remove(entity, components) {
    this.queue.add(new RemoveCommand(entity, components))
  }

  /**
   * Queues an entity and its components for removal.
   *
   * The entity is removed when the deferred change is applied. A stale entity
   * handle has no effect.
   *
   * @param {EntityHandle} entity - Entity to remove.
   * @returns {void}
   */
  despawn(entity) {
    this.queue.add(new DespawnCommand(entity))
  }

  /**
   * Queues a reparent operation for an entity.
   *
   * The change is applied later. When complete 2D or 3D transform component
   * sets are present, the entity keeps its world-space transform under the new
   * parent. Passing `undefined` detaches the entity. A parent that is the
   * entity itself or one of its descendants fails when the change is applied.
   *
   * @param {EntityHandle} entity - Entity to reparent.
   * @param {EntityHandle | undefined} [parent=undefined] - New parent, or
   * `undefined` to detach the entity.
   * @returns {void}
   */
  reparent(entity, parent = undefined) {
    this.queue.add(new ReparentCommand(entity, parent))
  }
}
