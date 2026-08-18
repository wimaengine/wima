/** @import { EntityHandle, World } from '@wimaengine/ecs' */
/** @import { TupleConstructor } from '@wimaengine/type' */
import { CommandQueue } from '@wimaengine/command'
import { assert } from '@wimaengine/logger'
import { CloneCommand, SpawnCommand, DespawnCommand, RemoveCommand, ReparentCommand } from '../commands'

const entityerror = 'Spawn an entity using `Entity.spawn()` before using '

export class EntityCommands {

  /**
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
   * @param {EntityHandle} entity
   */
  entity(entity) {
    this.buffered = new SpawnCommand(entity)

    return this
  }

  /**
   * @returns {this}
   */
  spawn() {
    const entity = this.world.spawn([])

    this.buffered = new SpawnCommand(entity)

    return this
  }

  /**
   * @template {unknown[]} T
   * @param {[...T][]} batch
   * @returns {EntityHandle[]}
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
   * Builds an entity with the components previously passed to
   * {@link EntityCommands.insert} and {@link EntityCommands.insertPrefab}.
   * @returns {EntityHandle}
   */
  build() {
    assert(this.buffered, `${entityerror}\`EntityCommands.build()\`.`)

    const { entity } = this.buffered

    this.queue.add(this.buffered)
    this.buffered = null

    return entity
  }

  /**
   * Inserts a component into a given entity.
   *
   * @template T
   * @param {T} component
   */
  insert(component) {
    assert(this.buffered, `${entityerror}\`EntityCommands.insert()\`.`)
    this.buffered.insert(component)

    return this
  }

  /**
   * @template {unknown[]} T
   * @param {[...T]} components
   * @returns {this}
   */
  insertPrefab(components) {
    assert(this.buffered, `${entityerror}\`EntityCommands.insertPrefab()\`.`)

    this.buffered.insertPrefab(components)

    return this
  }

  /**
   * Clones an entity and its descendants.
   *
   * @param {EntityHandle} entity
   * @returns {EntityHandle}
   */
  clone(entity) {
    const command = CloneCommand.create(this.world, entity)

    this.queue.add(command)

    return command.entity
  }

  /**
   * Removes components from a given entity.
   *
   * @template {unknown[]} T
   * @param {EntityHandle} entity
   * @param {TupleConstructor<T>} components
   */
  remove(entity, components) {
    this.queue.add(new RemoveCommand(entity, components))
  }

  /**
   * @param {EntityHandle} entity
   */
  despawn(entity) {
    this.queue.add(new DespawnCommand(entity))
  }

  /**
   * Reparents an entity while preserving its world transform.
   *
   * @param {EntityHandle} entity
   * @param {EntityHandle | undefined} [parent=undefined]
   */
  reparent(entity, parent = undefined) {
    this.queue.add(new ReparentCommand(entity, parent))
  }
}
