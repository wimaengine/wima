import { World, Entity } from '../../ecs/index.js'
import { Command } from '../core/index.js'

export class SpawnCommand extends Command {

  /**
   * @readonly
   * @type {Entity}
   */
  entity

  /**
   * @type {any[]}
   */
  components = []

  /**
   * @param {Entity} entity
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