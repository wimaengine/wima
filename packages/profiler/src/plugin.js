import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { warn } from '@wimaengine/logger'
import { TimerMode, VirtualClock } from '@wimaengine/time'
import { Profiler, ProfilerTimer } from './resources'
import { registerProfilerTypes } from './systems'

export class ProfilerPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.setResource(new Profiler())
    app.setResource(new ProfilerTimer({ duration: 1, mode: TimerMode.Repeat }))
    app.registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerProfilerTypes })
    setupProfileViewer(document.body)
    app.registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateProfileViewer })
    app.registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateProfileTimer })
  }
}

/**
 * @param {HTMLElement} parent
 */
function setupProfileViewer(parent) {
  const container = parent.appendChild(document.createElement('p'))

  container.id = 'profile-view'
  container.style.position = 'absolute'
  container.style.right = '0px'
  container.style.top = '0px'
  container.style.color = 'white'
  container.style.background = 'black'
}

/**
 * @param {World} registry
 */
function updateProfileTimer(registry) {
  const timer = registry.getResource(ProfilerTimer)
  const clock = registry.getResource(VirtualClock)

  timer.update(clock.getDelta())
}

/**
 * @param {World} registry
 */
function updateProfileViewer(registry) {
  const profiler = registry.getResource(Profiler)
  const timer = registry.getResource(ProfilerTimer)

  if (!timer.cycleEnded()) return

  const container = document.getElementById('profile-view')

  if (!container) return warn('no html element found to bind profiler to')

  container.innerHTML = ''

  for (const [key, value] of profiler.profiles) {
    const p = container.appendChild(document.createElement('p'))

    p.append(document.createTextNode(
      `${key}: ${value.delta.toFixed(4)}ms`
    ))
  }
}
