/**
 * Represents a 2x2 matrix.
 *
 *  | a | b |
 *  |---|---|
 *  | c | d |
 */
export class Matrix2 {

  /**
   * @type {number}
   */
  a

  /**
   * @type {number}
   */
  b

  /**
   * @type {number}
   */
  c

  /**
   * @type {number}
   */
  d

  /**
   * @param {number} e11
   * @param {number} e12
   * @param {number} e21
   * @param {number} e22
   */
  constructor(
    e11,
    e12,
    e21,
    e22
  ){
    this.a = e11
    this.b = e12
    this.c = e21
    this.d = e22
  }

  /**
   * Allows iteration of components.
   *
   * @yields {number}
   */
  * [Symbol.iterator]() {
    yield this.a
    yield this.b
    yield this.c
    yield this.d
  }
}