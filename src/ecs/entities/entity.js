import { packInto64Int, unpackFrom64Int } from 'vifaa'

export class EntityHandle {

  /**
   * @readonly
   * @type {number}
   */
  index

  /**
   * @readonly
   * @type {number}
   */
  generation

  /**
   * @param {number} index
   * @param {number} generation
   */
  constructor(index, generation) {
    this.index = index
    this.generation = generation
  }

  /**
   * @param {EntityHandle} other
   */
  equals(other) {
    return (
      this.index === other.index &&
      this.generation === other.generation
    )
  }

  /**
   * @returns {EntityId}
   */
  id() {
    const { index, generation } = this

    return packInto64Int(index, generation)
  }

  /**
   * @param {EntityId} id
   */
  static from(id) {
    const [index, generation] = unpackFrom64Int(id)

    return new EntityHandle(index, generation)
  }

  /**
   * @param {EntityHandle} value
   */
  static serialize(value) {
    return {
      index: value.index,
      generation: value.generation
    }
  }

  /**
   * @param {EntityId} value
   * @param {EntityHandle} [out]
   */
  static deserialize(value, out = new EntityHandle(0, 0)) {
    const [index, generation] = unpackFrom64Int(value)
    const target = /** @type {any} */ (out)

    target.index = index
    target.generation = generation

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is EntityId}
   */
  static validateSerial(value) {
    return typeof value === 'number'
  }
}

/**
 * @typedef {number} EntityId
 */
