import { EntityHandle } from '../../ecs/index.js'
import { TraverseEntities } from '../../relationship/index.js'

/**
 * @implements {TraverseEntities}
 */
export class Children {

  /**
   * @public
   * @type {EntityHandle[]}
   */
  list = []

  /**
   * @param {EntityHandle[]} children
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
    out.list = value.map((entity) => EntityHandle.deserialize(entity))

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
      if (!EntityHandle.validateSerial(value[i])) {
        return false
      }
    }

    return true
  }

  /**
   * @param {EntityHandle} entity
   */
  add(entity) {
    this.list.push(entity)
  }

  /**
   * @param {EntityHandle} entity
   */
  remove(entity) {
    this.list.splice(this.list.indexOf(entity), 1)
  }
  visit() {
    return this.list
  }

  /**
   * @param {Map<import('../../ecs/index.js').EntityId,import('../../ecs/index.js').EntityId>} entityMap
   */
  map(entityMap) {
    this.list = this.list.map((e) => EntityHandle.from(entityMap.get(e.id())))
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
