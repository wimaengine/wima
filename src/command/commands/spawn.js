/** @import { Entity, Tuple } from '../../ecs/index.js' */
import { World } from '../../ecs/index.js'
import { Command } from '../core/index.js'

export class SpawnCommand extends Command {

  /**
   * @readonly
   * @type {Entity}
   */
  entity = 0

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
   * @template {Tuple} T
   * @param {T} components
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