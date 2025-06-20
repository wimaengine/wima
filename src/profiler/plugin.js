import { Profiler, ProfilerTimer } from './resources/index.js'
import { Timer, TimerMode, VirtualClock } from '../time/index.js'
import { App, AppSchedule, Plugin } from '../app/index.js'
import { World } from '../ecs/index.js'
import { warn } from '../logger/index.js'

export class ProfilerPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.setResource(new Profiler())
    app.setResource(new ProfilerTimer(1, TimerMode.Repeat))
    setupProfileViewer(document.body)
    app.registerSystem(AppSchedule.Update, updateProfileViewer)
    app.registerSystem(AppSchedule.Update, updateProfileTimer)
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

  Timer.update(timer, clock.getDelta())
}

/**
 * @param {World} registry
 */
function updateProfileViewer(registry) {
  const profiler = registry.getResource(Profiler)
  const timer = registry.getResource(ProfilerTimer)

  if (!timer.finished) return

  const container = document.getElementById('profile-view')

  if(!container)return warn('no html element found to bind profiler to')

  container.innerHTML = ''

  for (const [key, value] of profiler.profiles) {
    const p = container.appendChild(document.createElement('p'))

    p.append(document.createTextNode(
      `${key}: ${value.delta.toFixed(4)}ms`
    ))
  }
}