/** @import {SystemFunc} from "../../ecs/index" */
export class SystemConfig {

  /**
   * @type {SystemFunc}
   */
  system

  /**
   * @type {string}
   */
  schedule

  /**
   * @param {SystemFunc} system
   * @param {string} schedule
   */
  constructor(system, schedule){
    this.system = system
    this.schedule = schedule
  }
}