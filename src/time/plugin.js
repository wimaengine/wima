import { World } from '../ecs/index.js'
import { App, Plugin } from '../app/index.js'
import { registerTimeTypes, updateTimers } from './systems/index.js'
import { VirtualClock } from './resource/index.js'
import { Clock } from './clock.js'
import { Timer } from './components/timer.js'
import { AppSchedule, CoreSystems } from '../core/index.js'

export class TimePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(Timer)
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerTimeTypes })
      .setResource(new VirtualClock())
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateVirtualClock })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateTimers })
  }
}

/**
 * @param {World} world
 */
function updateVirtualClock(world) {
  const clock = world.getResource(VirtualClock)

  Clock.update(clock)
}
