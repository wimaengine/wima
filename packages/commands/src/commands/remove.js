/** @import { EntityHandle, World } from '@wimaengine/ecs' */
/** @import { TupleConstructor } from '@wimaengine/type' */
import { Command } from '@wimaengine/command'

/**
 * @template {unknown[]} T
 */
export class RemoveCommand extends Command {

  /**
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * @readonly
   * @type {TupleConstructor<T>}
   */
  components

  /**
   * @param {EntityHandle} entity
   * @param {TupleConstructor<T>} components
   */
  constructor(entity, components) {
    super()
    this.entity = entity
    this.components = components
  }

  /**
   * @param {World} world
   */
  execute(world) {
    world.remove(this.entity, this.components)
  }
}
