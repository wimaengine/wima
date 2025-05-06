/** @import { Entity, Tuple } from '../../ecs/index.js' */
import { CommandQueue } from '../core/index.js'
import { SpawnCommand, DespawnCommand } from '../commands/index.js'
import { assert } from '../../logger/index.js'
import { World } from '../../ecs/index.js'

const entityerror = 'Spawn an entity using `Entity.spawn()` before using '

export class EntityCommands {

  /**
   * @private
   * @type {CommandQueue<SpawnCommand>}
   */
  spawnqueue = new CommandQueue()

  /**
   * @private
   * @type {CommandQueue<DespawnCommand>}
   */
  despawnqueue = new CommandQueue()

  /**
   * @private
   * @type {SpawnCommand | null}
   */
  buffered = null

  /**
   * @param {World} world
   */
  constructor(world) {
    this.world = world
  }

  /**
   * @param {Entity} entity
   */
  entity(entity) {
    this.buffered = new SpawnCommand(entity)

    return this
  }

  /**
   * @returns {this}
   */
  spawn() {
    const entity = this.world.create([])

    this.buffered = new SpawnCommand(entity)

    return this
  }

  /**
   * @template {unknown[]} T
   * @param {[...T][]} batch
   * @returns {Entity[]}
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
   * @returns {Entity}
   */
  build() {
    assert(this.buffered, `${entityerror}\`EntityCommands.build()\`.`)

    const { entity } = this.buffered

    this.spawnqueue.add(this.buffered)
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
   * @template {Tuple} T
   * @param {T} components
   * @returns {this}
   */
  insertPrefab(components) {
    assert(this.buffered, `${entityerror}\`EntityCommands.insertPrefab()\`.`)

    this.buffered.insertPrefab(components)

    return this
  }

  /**
   * @param {Entity} entity
   */
  despawn(entity) {
    this.despawnqueue.add(new DespawnCommand(entity))
  }

  /**
   * @param {World} world
   */
  apply(world) {
    this.spawnqueue.apply(world)
    this.despawnqueue.apply(world)
  }
  clear() {
    this.spawnqueue.clear()
    this.despawnqueue.clear()
  }
}