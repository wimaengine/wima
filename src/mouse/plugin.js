import { App, AppSchedule } from '../app/index.js'
import { Mouse, MouseButtons } from './resources/index.js'
import { MouseButton } from './core/index.js'
import { World } from '../ecs/index.js'
import { EventDispatch } from '../event/index.js'
import { MouseDown, MouseUp } from '../window/index.js'

export class MousePlugin {

  /**
   * @param {App} app
   */
  register(app) {

    app
      .setResource(new Mouse())
      .setResource(new MouseButtons())
      .registerSystem(AppSchedule.Update, updateMouse)
      .registerSystem(AppSchedule.Update, updateMouseButtons)
  }
}

/**
 * @param {World} world
 */
function updateMouse(world) {
  const mouse = world.getResource('mouse')
  const move = world.getResource('events<mousemove>').readLast()

  if (!move) return

  mouse.position.copy(move.data.position)
}

/**
 * @param {World} world
 */
function updateMouseButtons(world) {

  /** @type {MouseButtons} */
  const buttons = world.getResource('mousebuttons')

  /** @type {EventDispatch<MouseDown>} */
  const down = world.getResource('events<mousedown>')

  /** @type {EventDispatch<MouseUp>} */
  const up = world.getResource('events<mouseup>')

  buttons.clearJustPressed()
  buttons.clearJustReleased()

  down.each((event) => {
    const button = mapMouseButtons(event.data.key)

    buttons.press(button)
  })
  up.each((event) => {
    const button = mapMouseButtons(event.data.key)

    buttons.release(button)
  })
}

/**
 * @param {number} keycode
 */
function mapMouseButtons(keycode) {
  switch (keycode) {
    case 0:
      return MouseButton.Left

    case 1:
      return MouseButton. Wheel

    case 2:
      return MouseButton.Right

    case 3:
      return MouseButton.Back

    case 4:
      return MouseButton.Forward

    case 5:
      return MouseButton.Dpi

    default:
      return MouseButton.Unidentified
  }
}