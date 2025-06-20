import { World } from '../ecs/index.js'
import { VirtualClock } from './resource/index.js'
import { App, Plugin } from '../app/app.js'
import { AppSchedule } from '../app/schedules.js'
import { Clock } from './clock.js'

export class TimePlugin extends Plugin{

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
  const clock = world.getResource(VirtualClock)

  Clock.update(clock)
}