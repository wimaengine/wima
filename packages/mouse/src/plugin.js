import { App, Plugin } from '@wimaengine/app'
import { Mouse, MouseButtons } from './resources'
import { MouseButton } from './core'
import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { PointerDown, PointerMove, PointerUp } from '@wimaengine/window'
import { Vector2 } from '@wimaengine/math'
import { typeidGeneric } from '@wimaengine/type'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { registerMouseTypes } from './systems'

export class MousePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {

    app
      .setResource(new Mouse())
      .setResource(new MouseButtons())
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerMouseTypes })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateMouse })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateMouseButtons })
  }
}

/**
 * @param {World} world
 */
function updateMouse(world) {
  const mouse = world.getResource(Mouse)
  const moves = /** @type {Events<PointerMove>} */(world.getResourceByTypeId(typeidGeneric(Events, [PointerMove])))
  const move = moves.readLast()

  mouse.delta.copy(Vector2.Zero)
  mouse.lastPosition.copy(mouse.position)

  if (!move) return

  mouse.delta.copy(move.data.delta)
  mouse.position.copy(move.data.position)
}

/**
 * @param {World} world
 */
function updateMouseButtons(world) {
  const buttons = world.getResource(MouseButtons)

  /** @type {Events<PointerDown>} */
  const down = world.getResourceByTypeId(typeidGeneric(Events, [PointerDown]))

  /** @type {Events<PointerUp>} */
  const up = world.getResourceByTypeId(typeidGeneric(Events, [PointerUp]))

  buttons.clearJustPressed()
  buttons.clearJustReleased()

  down.each((event) => {
    if (event.data.pointerType !== 'mouse') return

    const button = mapMouseButtons(event.data.key)

    buttons.press(button)
  })
  up.each((event) => {
    if (event.data.pointerType !== 'mouse') return

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
