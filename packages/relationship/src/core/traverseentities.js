import { EntityHandle } from '@wimaengine/ecs'
import { abstractMethod } from '@wimaengine/utils'

/**
 * @interface
 */
export class TraverseEntities {

  /**
   * @returns {EntityHandle[]}
   * @throws {string} Throws when the method is not implemented on implementing class.
   */
  visit() {
    throw abstractMethod(this, TraverseEntities, this.visit)
  }

  /**
   * @param {Map<import('@wimaengine/ecs').EntityId, import('@wimaengine/ecs').EntityId>} _entityMap
   * @throws {string} Throws when the method is not implemented on implementing class.
   */
  map(_entityMap) {
    throw abstractMethod(this, TraverseEntities, this.map)
  }
}
