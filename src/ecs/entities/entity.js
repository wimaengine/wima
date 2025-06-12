export class Entity {

  /**
   * @readonly
   * @type {number}
   */
  index

  /**
   * @param {number} index
   */
  constructor(index){
    this.index = index
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