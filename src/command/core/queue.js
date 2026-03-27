/** @import { CommandFn } from '../typedef/index.js' */
import { World } from '../../ecs/index.js'
import { Command } from './command.js'

/**
 * @template {Command} T
 */
export class CommandQueue {

  /**
   * @private
   * @type {T[]}
   */
  queue = []

  /**
   * @param {T} command
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