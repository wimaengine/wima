export class Attribute{

  /**
   * @private
   * @type {number}
   */
  size

  /**
   * @private
   * @type {Float32Array}
   */
  /**
   * @param {Float32Array} data 
   * @param {number} size 
   */
  constructor(data, size){
    this.data = data
    this.size = size
  }
}