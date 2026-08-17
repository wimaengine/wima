import { Command } from '@wimaengine/command'
import { World } from '@wimaengine/ecs'

export class AddResourceCommand extends Command {

  /**
   * @readonly
   * @type {object}
   */
  resource

  /**
   * @param {object} resource
   */
  constructor(resource) {
    super()
    this.resource = resource
  }

  /**
   * @param {World} world
   */
  execute(world) {
    world.setResource(this.resource)
  }
}
