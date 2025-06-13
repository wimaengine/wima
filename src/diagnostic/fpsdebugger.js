import { App, AppSchedule, Plugin } from '../app/index.js'
import { World } from '../ecs/index.js'
import { Timer, TimerMode, VirtualClock } from '../time/index.js'
import { RAFTimer } from './resources/index.js'

export class FPSDebugger extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new RAFTimer(1, TimerMode.Repeat))
      .registerSystem(AppSchedule.Startup, setUpUI)
      .registerSystem(AppSchedule.Update, updateFPSCounter)
      .registerSystem(AppSchedule.Update, updateRAFTimer)
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

  if (!timer.finished) return

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

  Timer.update(timer, clock.getDelta())
}