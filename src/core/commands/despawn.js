/** @import { Entity } from '../../ecs/index.js' */
import { Command } from '../../command/index.js'
import { World } from '../../ecs/registry.js'

export class DespawnCommand extends Command {

  /**
   * @type {Entity}
   */
  entity

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
    world.despawn(this.entity)
  }
}
