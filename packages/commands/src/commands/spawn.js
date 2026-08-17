/** @import { EntityHandle, World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'

export class SpawnCommand extends Command {

  /**
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * @type {any[]}
   */
  components = []

  /**
   * @param {EntityHandle} entity
   */
  constructor(entity) {
    super()
    this.entity = entity
  }

  /**
   * @template T
   * @param {T} component
   */
  insert(component) {
    this.components.push(component)
  }

  /**
   * @template {unknown[]} T
   * @param {[...T]} components
   */
  insertPrefab(components) {
    this.components.push(...components)
  }

  /**
   * @param {World} registry
   */
  execute(registry) {
    registry.insert(this.entity, this.components)
  }
}
