import { Entity } from '../../ecs/index.js'
import { abstractMethod } from '../../utils/errors.js'

/**
 * @interface
 */
export class VisitEntities {

  /**
   * @returns {Entity[]}
   * @throws {string} Throws when the method is not implemented on implementing class.
   */
  visit() {
    throw abstractMethod(this, VisitEntities, this.visit)
  }

  /**
   * @param {Map<import('../../ecs/index.js').EntityId, import('../../ecs/index.js').EntityId>} _entityMap
   * @throws {string} Throws when the method is not implemented on implementing class.
   */
  map(_entityMap) {
    throw abstractMethod(this, VisitEntities, this.map)
  }
}
