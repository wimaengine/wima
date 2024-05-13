import { assert } from '../logger/index.js'

/**
 * @template T
 */
export class ArrayView {

  /**
   * @readonly
   * @type {number}
   */
  length = 0

  /**
   * @readonly
   * @type {number}
   */
  offset = 0

  /**
   * @type {Array<T>}
   */
  array

  /**
   * @param {Array<T>} arr
   * @param {number} offset
   * @param {number} length
   */
  constructor(arr, offset, length) {
    this.array = arr
    this.offset = offset
    this.length = length

    assert(offset + length < arr.length, 'The `View()`\'s range is beyond the range of the provided array.')
  }
}