/**
* Clamps a value between two numbers.
*
* @param {number} value - The number to clamp.
* @param {number} min - The minimal bound of the clamped number.
* @param {number} max - The maximum bound of the clamped number.
* @returns {number}
*/
export function clamp(value, min, max) {
  if (value < min) return min
  if (value > max) return max

  return value
}

/**
 * @param {number} value 
 * @param {number} step 
 * @returns {number}
 */
export function snap(value, step) {
    return Math.round(value / step) * step
  }
  
  /**
   * @param {number} value 
   * @param {number} step 
   * @returns {number}
   */
  export function snapDown(value, step) {
    return Math.floor(value / step) * step
  }
  
  /**
   * @param {number} value 
   * @param {number} step 
   * @returns {number}
   */
  export function snapUp(value, step) {
    return Math.ceil(value / step) * step
  }
  
  