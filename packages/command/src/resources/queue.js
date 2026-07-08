/** @import { CommandFn } from '../typedef' */
import { Command } from '../core'

export class CommandQueue {

  /**
   * @private
   * @type {Command[]}
   */
  queue = []

  /**
   * @param {Command} command
   */
  add(command) {
    this.queue.push(command)
  }

  drain() {
    const { queue } = this

    this.queue = []

    return queue
  }

  /**
   * @returns {number}
   */
  size() {
    return this.queue.length
  }
}
