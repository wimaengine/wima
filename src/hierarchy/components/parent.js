import { Entity } from '../../ecs/index.js'
import { VisitEntities } from '../../relationship/index.js'

/**
 * @implements {VisitEntities}
 */
export class Parent {

  /**
   * @public
   * @type {Entity}
   */
  entity

  /**
   * @param {Entity} entity
   */
  constructor(entity) {
    this.entity = entity
  }

  /**
   * @param {Parent} source
   * @param {Parent} target
   */
  static copy(source, target = new Parent(source.entity)) {
    target.entity = source.entity

    return target
  }

  /**
   * @param {Parent} target
   */
  static clone(target) {
    return Parent.copy(target)
  }

  /**
   * @param {Parent} value
   */
  static serialize(value) {
    return value.entity.id()
  }

  /**
   * @param {ParentSerial} value
   * @param {Parent} [out]
   */
  static deserialize(value, out = new Parent(new Entity(0, 0))) {
    out.entity = Entity.deserialize(value, out.entity)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is ParentSerial}
   */
  static validateSerial(value) {
    return Entity.validateSerial(value)
  }
  visit() {
    return [this.entity]
  }
}

/**
 * @typedef {import('../../ecs/entities/entity.js').EntityId} ParentSerial
 */
