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
    return this.index === other.index
  }

  /**
   * @returns {EntityId}
   */
  id(){
    return this.index
  }
}

/**
 * @typedef {number} EntityId
 */