import { Vector2 } from '../../../math/index.js'

export class FileDrag {
  position = new Vector2()

  /**
   * @param {DragEvent} event
   */
  constructor(event){
    this.position.set(event.clientX, event.clientY)
  }
}