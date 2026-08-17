/** @import {Constructor} from '@wimaengine/type' */
import { Command } from '@wimaengine/command'
import { World } from '@wimaengine/ecs'

export class RemoveResourceCommand extends Command {

  /**
   * @readonly
   * @type {Constructor}
   */
  resourceType

  /**
   * @param {Constructor} resourceType
   */
  constructor(resourceType) {
    super()
    this.resourceType = resourceType
  }

  /**
   * @param {World} world
   */
  execute(world) {
    world.removeResource(this.resourceType)
  }
}
