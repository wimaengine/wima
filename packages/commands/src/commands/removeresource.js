/** @import {Constructor} from '@wimaengine/type' */
import { Command } from '@wimaengine/command'

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
   * @param {import('@wimaengine/ecs').World} world
   */
  execute(world) {
    world.removeResource(this.resourceType)
  }
}
