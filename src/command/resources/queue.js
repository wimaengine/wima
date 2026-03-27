/** @import { CommandFn } from '../typedef/index.js' */
import { Command } from '../core/command.js'

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

  drain(){
    const queue = this.queue
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