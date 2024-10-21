export class WindowResize {

  /**
   * @readonly
   * @type {number}
   */
  width 

  /**
   * @readonly
   * @type {number}
   */
  height

  /**
   * @param {UIEvent} event
   */
  constructor(event){
    this.width = /** @type {HTMLCanvasElement}*/(event.target).width
    this.height = /** @type {HTMLCanvasElement}*/(event.target).height
  }
}