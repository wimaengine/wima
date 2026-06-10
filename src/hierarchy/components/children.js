import { Entity } from '../../ecs/index.js'
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
    return Children.copy(target)
  }

  /**
   * @param {Children} value
   */
  static serialize(value) {
    return value.list.map((entity) => entity.id())
  }

  /**
   * @param {ChildrenSerial} value
   * @param {Children} [out]
   */
  static deserialize(value, out = new Children([])) {
    out.list = value.map((entity) => Entity.deserialize(entity))

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is ChildrenSerial}
   */
  static validateSerial(value) {
    if (!Array.isArray(value)) {
      return false
    }

    for (let i = 0; i < value.length; i++) {
      if (!Entity.validateSerial(value[i])) {
        return false
      }
    }

    return true
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

/**
 * @typedef {import('../../ecs/entities/entity.js').EntityId[]} ChildrenSerial
 */
