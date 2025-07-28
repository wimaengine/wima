/**
 * Interpolates between two numbers by a constant t.
 *
 * @param {number} from - The minimal bound of the interpolation.
 * @param {number} to - The maximum bound of the interpolation.
 * @param {number} t - A number between 0 and 1 to interpolate 
 * by.Any other number greater than 1 or less than 0 will
 * extapolate beyond b or a respectively.
 * @returns {number}
 */
export function lerp(from, to, t) {
  return from + t * (to - from)
}

/**
 * Gets the interpolation constant between two numbers give a value
 * between them.
 *
 * @param {number} from - The minimal bound of the interpolation.
 * @param {number} to - The maximum bound of the interpolation.
 * @param {number} value - The value between the bounds.
 * @returns {number} A number between 0 and 1 if value respects 
 * the bounds.
 */
export function inverseLerp(from, to, value) {
  return (value - from) / (to - from)
}

/**
 * Maps a value from one range to another.
 *
 * @param {number} v
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function remap(v, x1, y1, x2, y2) {
  return x2 + v * (y2 - x2) / (y1 - x1)
}

export const Interpolation = {

  /**
   * @param {number} p0
   * @param {number} p1
   * @param {number} t
   *
   * @returns {number}
   */
  Linear(p0, p1, t) {
    return (p1 - p0) * t + p0
  },
  
  /**
   * @param {number} p0
   * @param {number} p1
   * @param {number} p2
   * @param {number} p3
   * @param {number} t
   *
   * @returns {number}
   */
  CatmullRom(p0, p1, p2, p3, t) {
    const v0 = (p2 - p0) * 0.5
    const v1 = (p3 - p1) * 0.5
    const t2 = t * t
    const t3 = t * t2
  
    return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
  },
  
  /**
   * @param {number} p0
   * @param {number} p1
   * @param {number} t
   */
  cosine(p0, p1, t) {
    const c = (1 - Math.cos(t * 3.1415927)) * 0.5
  
    return (1 - c) * p0 + c * p1
  }
}