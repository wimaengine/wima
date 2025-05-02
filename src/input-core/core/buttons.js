/**
 * @template T
 */
export class Buttons {

  /**
   * @private
   * @type {Set<T>}
   */
  innerPressed = new Set()

  /**
   * @private
   * @type {Set<T>}
   */
  innerJustPressed = new Set()

  /**
   * @private
   * @type {Set<T>}
   */
  innerJustReleased = new Set()

  /**
   * @param {T} button
   */
  press(button) { 
    if(!this.innerPressed.has(button)){
      this.innerJustPressed.add(button)
    }

    this.innerPressed.add(button)
  }

  /**
   * @param {T} button
   */
  release(button) { 
    this.innerJustReleased.add(button)
    this.innerPressed.delete(button)
  }

  /**
   * @param {T} button 
   * @returns {boolean}
   */
  pressed(button) {
    return this.innerPressed.has(button)
  }

  /**
   * @param {T} button 
   * @returns {boolean}
   */
  justPressed(button) {
    return this.innerPressed.has(button)
  }

  /**
   * @param {T} button 
   * @returns {boolean}
   */
  justReleased(button) {
    return this.innerJustReleased.has(button)
  }
  clearJustPressed() {
    this.innerJustPressed.clear()
  }
  clearJustReleased() {
    this.innerJustReleased.clear()
  }
  clearPressed() {
    this.innerPressed.clear()
  }
}