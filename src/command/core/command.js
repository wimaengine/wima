import { World } from '../../ecs/index.js'

export class Command {

  /**
   * @param {World} _world
   */
  execute(_world) { }

  /**
   * @param {World} _world
   */
  undo(_world) { }
}