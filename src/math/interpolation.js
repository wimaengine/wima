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