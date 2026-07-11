import { EntityHandle } from '@wimaengine/ecs'
import { TraverseEntities } from '@wimaengine/relationship'

/**
 * @implements {TraverseEntities}
 */
export class Parent {

  /**
   * @public
   * @type {EntityHandle}
   */
  entity

  /**
   * @param {EntityHandle} entity
   */
  constructor(entity) {
    this.entity = entity
  }

  visit() {
    return [this.entity]
  }

  /**
   * @param {Map<import('@wimaengine/ecs').EntityId,import('@wimaengine/ecs').EntityId>} entityMap
   */
  map(entityMap) {
    this.entity = EntityHandle.from(entityMap.get(this.entity.id()))
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
  static deserialize(value, out = new Parent(new EntityHandle(0, 0))) {
    out.entity = EntityHandle.deserialize(value, out.entity)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is ParentSerial}
   */
  static validateSerial(value) {
    return EntityHandle.validateSerial(value)
  }
}

/**
 * @typedef {import('@wimaengine/ecs').EntityId} ParentSerial
 */
