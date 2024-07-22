/** @import { Entity } from '../../ecs/index.js' */
import { World } from '../../ecs/registry.js'
import { Command } from '../core/index.js'

export class DespawnCommand extends Command {

  /**
   * @type {Entity}
   */
  entity = 0

  /**
   * @param {Entity} entity
   */
  constructor(entity) {
    super()
    this.entity = entity
  }

  /**
   * @param {World} world
   */
  execute(world) {
    world.remove(this.entity)
  }
}