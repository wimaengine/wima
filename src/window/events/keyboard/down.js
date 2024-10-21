export class KeyDown {
  
  /**
   * @type {string}
   */
  key
  
  /**
   * @type {string}
   */
  code
  
  /**
   * @type {number}
   */
  location
  
  /**
   * @type {EventTarget | null}
   */
  target
  
  /**
   * @param {KeyboardEvent} event
   */
  constructor(event) {
    this.scancode = event.code
    this.key = event.key
    this.code = event.code
    this.location = event.location
    this.target = event.target
  }
}