/** @import {Constructor, TypeId} from '@wimaengine/type' */
import { Command } from '@wimaengine/command'
import { World } from '@wimaengine/ecs'

export class SetResourceAliasCommand extends Command {

  /**
   * @readonly
   * @type {TypeId}
   */
  id

  /**
   * @readonly
   * @type {Constructor}
   */
  alias

  /**
   * @param {TypeId} id
   * @param {Constructor} alias
   */
  constructor(id, alias) {
    super()
    this.id = id
    this.alias = alias
  }

  /**
   * @param {World} world
   */
  execute(world) {
    world.setResourceAlias(this.id, this.alias)
  }
}
