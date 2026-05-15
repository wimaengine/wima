import { Scheduler } from '../index.js'
import { assert } from '../../logger/index.js'
import { SystemConfig } from './systemconfig.js'

export class SchedulerBuilder {

  /**
   * @private
   * @type {SystemConfig[]}
   */
  systems = []

  /**
   * @private
   * @type {SystemGroupConfig[]}
   */
  systemGroups = []

  /**
   * @param {SystemConfig} config
   */
  add(config) {
    this.systems.push(config)
  }

  /**
   * @param {SystemGroupConfig} config
   */
  addGroup(config) {
    this.systemGroups.push(config)
  }

  /**
   * @param {Scheduler} scheduler
   */
  pushToScheduler(scheduler) {
    for (let i = 0; i < this.systems.length; i++) {
      const config = this.systems[i]

      const schedule = scheduler.get(config.schedule)

      assert(schedule, `The schedule label "${config.schedule}" is not set in the provided \`Scheduler\`.`)

      schedule.add(config.system)
    }
  }
}

/**
 * @typedef SystemGroupConfig
 * @property {import('../../type/index.js').Constructor} label
 */
