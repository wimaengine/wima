/**
 * Represents an event.
 * 
 * @template T
 */
export class CEvent {

  /**
   * @readonly
   * @type {T}
   */
  data
    
  /**
   * @param {T} data
   */
  constructor(data) {
    this.data = data
  }
}