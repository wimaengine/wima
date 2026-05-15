/** @import {SystemFunc} from "../../ecs/index.js" */
export class SystemConfig {

  /**
   * @type {import("../../type/index.js").Constructor | undefined}
   */
  systemGroup

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
   * @param {import("../../type/index.js").Constructor | undefined} [systemGroup]
   */
  constructor(system, schedule, systemGroup) {
    this.system = system
    this.schedule = schedule
    this.systemGroup = systemGroup
  }
}
