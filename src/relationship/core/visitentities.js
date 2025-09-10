import { Entity } from '../../ecs/index.js'

/**
 * @interface
 */
export class VisitEntities {

  /**
   * @returns {Entity[]}
   * @throws {string} Throws when the method is not implemented on implementing class.
   */
  visit() {
    throw `The method \`${this.constructor.name}.visit\` is not implemented correctly.`
  }
}