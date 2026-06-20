import { Entity } from '../../ecs/index.js'
import { abstractMethod } from '../../utils/index.js'

/**
 * @interface
 */
export class TraverseEntities {

  /**
   * @returns {Entity[]}
   * @throws {string} Throws when the method is not implemented on implementing class.
   */
  visit() {
    throw abstractMethod(this, TraverseEntities, this.visit)
  }

  /**
   * @param {Map<import('../../ecs/index.js').EntityId, import('../../ecs/index.js').EntityId>} _entityMap
   * @throws {string} Throws when the method is not implemented on implementing class.
   */
  map(_entityMap) {
    throw abstractMethod(this, TraverseEntities, this.map)
  }
}
