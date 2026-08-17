/** @import { EntityHandle, World } from '@wimaengine/ecs' */
import { Command } from '@wimaengine/command'

export class DespawnCommand extends Command {

  /**
   * @type {EntityHandle}
   */
  entity

  /**
   * @param {EntityHandle} entity
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
