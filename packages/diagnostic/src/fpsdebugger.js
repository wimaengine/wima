import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { TimerMode, VirtualClock } from '@wimaengine/time'
import { RAFTimer } from './resources'
import { registerFpsDebuggerTypes } from './systems'

export class FPSDebugger extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new RAFTimer({ duration: 1, mode: TimerMode.Repeat }))
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerFpsDebuggerTypes })
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: setUpUI })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateFPSCounter })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateRAFTimer })
  }
}

/**
 *
 */
function setUpUI() {
  const container = document.body.appendChild(document.createElement('div'))

  container.id = 'fps-container'
  container.style.position = 'absolute'
  container.style.top = '0px'
  container.style.right = '0px'
  container.style.width = '100px'
  container.style.height = '20px'
  container.style.background = 'black'
  container.style.textAlign = 'center'
  container.style.color = 'white'
}

/**
 * @param {World} world
 */
function updateFPSCounter(world) {
  const clock = world.getResource(VirtualClock)
  const timer = world.getResource(RAFTimer)

  if (!timer.cycleStarted()) return

  const container = document.querySelector('#fps-container')
  const fps = Math.round(clock.getFrameRate())

  if (container) container.innerHTML = `${fps} fps`
}

/**
 * @param {World} world
 */
function updateRAFTimer(world) {
  const clock = world.getResource(VirtualClock)
  const timer = world.getResource(RAFTimer)

  timer.update(clock.getDelta())
}
