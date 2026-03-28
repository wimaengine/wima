/** @import { Entity } from '../../ecs/index.js' */

import { VisitEntities } from '../../relationship/index.js'

/**
 * @implements {VisitEntities}
 */
export class Children {

  /**
   * @public
   * @type {Entity[]}
   */
  list = []

  /**
   * @param {Entity[]} children
   */
  constructor(children = []) {
    this.list = children
  }

  /**
   * @param {Children} source
   * @param {Children} target
   */
  static copy(source, target = new Children()) {
    target.list = source.list.slice()

    return target
  }

  /**
   * @param {Children} target
   */
  static clone(target) {
    return this.copy(target)
  }

  /**
   * @param {Entity} entity
   */
  add(entity) {
    this.list.push(entity)
  }

  /**
   * @param {Entity} entity
   */
  remove(entity) {
    this.list.splice(this.list.indexOf(entity), 1)
  }
  visit() {
    return this.list
  }

  /**
   */
  clear() {
    this.list.length = 0
  }
}
