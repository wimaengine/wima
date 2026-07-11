import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { Clock } from './clock'
import { VirtualClock } from './resource'
import { registerTimeTypes, updateTimers } from './systems'

export class TimePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
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
