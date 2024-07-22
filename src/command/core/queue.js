/** @import { CommandFn } from '../typedef/index.js' */
import { World } from '../../ecs/index.js'
import { Command } from './command.js'

/**
 * @template {Command} T
 */
export class CommandQueue {

  /**
   * @private
   * @type {CommandFn<T>}
   */
  command

  /**
   * @private
   * @type {T[]}
   */
  queue = []

  /**
   * @param {CommandFn<T>} [commandfn]
   */
  constructor(commandfn = defaultCommandFn) {
    this.command = commandfn
  }

  /**
   * @param {T} command
   */
  add(command) {
    this.queue.push(command)
  }

  /**
   * @param {World} registry
   */
  apply(registry) {
    for (let i = 0; i < this.queue.length; i++) {
      this.command(this.queue[i], registry)
    }
  }
  clear() {
    this.queue.length = 0
  }

  /**
   * @returns {Readonly<T[]>}
   */
  getQueue() {
    return this.queue
  }

  /**
   * @returns {number}
   */
  size() {
    return this.queue.length
  }
}

/**
 * @type {CommandFn<any>}
 */
function defaultCommandFn(command, registry) {
  command.execute(registry)
}