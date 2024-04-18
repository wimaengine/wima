/** @import {SystemFunc,SystemId} from '../typedef/index.js' */
import { Bitset } from '../../datastructures/index.js'
import { World } from '../registry.js'

/**
 * Stores a collection of {@link SystemFunc systems} which 
 * are in order.
 * @example
 * ```ts
 * function helloWorld(){
 *   console.log("hello world")
 * }
 * 
 * const schedule = new Schedule()
 * 
 * //Add the system to the schedule
 * schedule.add(helloWorld)
 * 
 * //runs systems in the schedule
 * schedule.run()
 * ```
 */
export class Schedule {

  /**
   * @private
   * @type {SystemFunc[]}
   */
  systems = []

  /**
   * @private
   * @type {Bitset}
   */
  condition = new Bitset()

  /**
   * @param {SystemFunc} system
   * @returns {SystemId}
   */
  add(system) {
    const { length } = this.systems

    this.systems.push(system)
    this.condition.resize(length + 1)
    this.condition.set(length)

    return length
  }

  /**
   * @param {World} registry
   */
  run(registry) {
    for (let i = 0; i < this.systems.length; i++) {
      if (this.condition.get(i)) this.systems[i](registry)
    }
  }
}