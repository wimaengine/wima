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
    if(this.innerPressed.delete(button)){
      this.innerJustReleased.add(button)
    }
  }

  /**
   * @param {T} button 
   * @returns {boolean}
   */
  pressed(button) {
    return this.innerPressed.has(button)
  }

  /**
   * @param {T[]} buttons
   * @returns {boolean}
   */
  anyJustPressed(...buttons){
    for (let i = 0; i < buttons.length; i++) {
      if(this.justPressed(buttons[i])){
        return true
      }
    }

    return false
  }

  /**
   * @param {T[]} buttons
   * @returns {boolean}
   */
  anyPressed(...buttons){
    for (let i = 0; i < buttons.length; i++) {
      if(this.pressed(buttons[i])){
        return true
      }
    }

    return false
  }

  /**
   * @param {T[]} buttons
   * @returns {boolean}
   */
  anyJustReleased(...buttons){
    for (let i = 0; i < buttons.length; i++) {
      if(this.justReleased(buttons[i])){
        return true
      }
    }

    return false
  }

  /**
   * @param {T} button 
   * @returns {boolean}
   */
  justPressed(button) {
    return this.innerJustPressed.has(button)
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