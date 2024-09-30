import { World } from '../ecs/index.js'
import { VirtualClock } from './resource/index.js'
import { App } from '../app/app.js'
import { AppSchedule } from '../app/schedules.js'
import { Clock } from './clock.js'

export class TimePlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new VirtualClock())
      .registerSystem(AppSchedule.Update, updateVirtualClock)
  }
}

/**
 * @param {World} world
 */
function updateVirtualClock(world) {
  const clock = world.getResource('virtualclock')

  Clock.update(clock)
}