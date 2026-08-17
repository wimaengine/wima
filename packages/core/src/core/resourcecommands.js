/** @import {Constructor, TypeId} from '@wimaengine/type' */
import { CommandQueue } from '@wimaengine/command'
import { World } from '@wimaengine/ecs'
import { AddResourceCommand, RemoveResourceCommand, SetResourceAliasCommand } from '../commands'

export class ResourceCommands {

  /**
   * @private
   * @type {CommandQueue}
   */
  buffer

  /**
   * @param {World} world
   */
  constructor(world) {
    this.buffer = world.getResource(CommandQueue)
  }

  /**
   * @param {object} resource
   * @returns {this}
   */
  add(resource) {
    this.buffer.add(new AddResourceCommand(resource))

    return this
  }

  /**
   * @param {Constructor} resourceType
   * @returns {this}
   */
  remove(resourceType) {
    this.buffer.add(new RemoveResourceCommand(resourceType))

    return this
  }

  /**
   * @param {TypeId} id
   * @param {Constructor} alias
   * @returns {this}
   */
  setAlias(id, alias) {
    this.buffer.add(new SetResourceAliasCommand(id, alias))

    return this
  }
}
