import { World } from '../ecs/index.js'
import { AppSchedule, App, Plugin } from '../app/index.js'
import { updateTimers } from './systems/index.js'
import { VirtualClock } from './resource/index.js'
import { Clock } from './clock.js'
import { Timer } from './components/timer.js'

export class TimePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Timer)
      .setResource(new VirtualClock())
      .registerSystem(AppSchedule.Update, updateVirtualClock)
      .registerSystem(AppSchedule.Update, updateTimers)
  }
}

/**
 * @param {World} world
 */
function updateVirtualClock(world) {
  const clock = world.getResource(VirtualClock)

  Clock.update(clock)
}