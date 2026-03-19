/** @import { TouchId } from "../typedef/index.js" */
import { TouchPointer } from '../core/index.js'

/**
 * Handles the touch input of an application from a smartphone,tablet or PCs with touchscreens.
 */
export class Touches {

  /**
   * @private
   * @type {(TouchPointer | undefined)[]}
   */
  list = new Array(10).fill(undefined)

  /**
   * @private
   * @type {Map<number, TouchId>}
   */
  pointerMap = new Map()

  /**
   * @param {number} pointerId
   * @returns {TouchId | undefined}
   */
  getId(pointerId) {
    return this.pointerMap.get(pointerId)
  }

  /**
   * @returns {TouchPointer | undefined}
   */
  getFirst() {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i]) return this.list[i]
    }

    return undefined
  }

  /**
   * @returns {TouchPointer | undefined}
   */
  getLast() {
    for (let i = 9; i >= 0; i--) {
      if (this.list[i]) return this.list[i]
    }
  }

  /**
   * @returns {TouchPointer[]}
   */
  getActive() {
    return this.list.filter((e) => e !== undefined)
  }

  /**
   * @param {number} pointerId
   * @param {TouchPointer} pointer
   * @returns {number}
   */
  set(pointerId, pointer) {
    let id = this.getId(pointerId)

    if (id === undefined) {
      for (let i = 0; i < this.list.length + 1; i++) {
        if (!this.list[i]) {
          id = i
          this.pointerMap.set(pointerId, i)
          break
        }
      }
    }

    // Safety: Can only allocate id here
    // @ts-ignore
    pointer.id = id
    this.list[id] = pointer

    return id
  }

  /**
   * @param {number} pointerId
   * @returns {number | undefined}
   */
  delete(pointerId) {
    const id = this.getId(pointerId)

    if (id === undefined) return undefined

    this.list[id] = undefined
    this.pointerMap.delete(pointerId)

    return id
  }

  /**
   * @param {TouchId} id
   * @returns {TouchPointer | undefined}
   */
  get(id) {
    return this.list[id]
  }
}
