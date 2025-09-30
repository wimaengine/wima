import { packInto64Int, unpackFrom64Int } from '../../algorithms/packnumber.js'

export class Entity {

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
  constructor(index, generation){
    this.index = index
    this.generation = generation
  }

  /**
   * @param {Entity} other
   */
  equals(other){
    return (
      this.index === other.index &&
      this.generation === other.generation
    )
  }

  /**
   * @returns {EntityId}
   */
  id(){
    const { index, generation } = this

    return packInto64Int(index, generation)
  }

  /**
   * @param {EntityId} id
   */
  static from(id){
    const [index, generation] = unpackFrom64Int(id)

    return new Entity(index, generation)
  }
}

/**
 * @typedef {number} EntityId
 */