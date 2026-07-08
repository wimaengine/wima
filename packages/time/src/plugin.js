import { World } from '@wimaengine/ecs'
import { App, Plugin } from '@wimaengine/app'
import { registerTimeTypes, updateTimers } from './systems'
import { VirtualClock } from './resource'
import { Clock } from './clock'
import { Timer } from './components'
import { AppSchedule, CoreSystems } from '@wimaengine/core'

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
