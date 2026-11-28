/** @import { DOMWindowPlugin } from '@wimaengine/window-dom' */
/** @import { TypeId } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { MathPlugin, Vector2, Vector3 } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { PointerDown, PointerMove, PointerUp, PointerWheel, WindowPlugin } from '@wimaengine/window'
import { MouseButton } from './core'
import { Mouse, MouseButtons } from './resources'
import { registerMouseTypes } from './systems'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds mouse input support to an {@linkcode App}.
 *
 * The plugin provides {@linkcode Mouse} and {@linkcode MouseButtons} resources in
 * the app's default world. Use {@linkcode Mouse} for pointer position and
 * movement, and {@linkcode MouseButtons} for held, just-pressed, and
 * just-released {@linkcode MouseButton} values.
 *
 * These resources respond only to mouse input. {@linkcode Mouse} exposes the
 * pointer position, movement, and wheel scrolling, while {@linkcode MouseButtons}
 * exposes button transitions. Input from other pointer types is ignored.
 *
 * {@linkcode WindowPlugin} provides the typed pointer events consumed by this
 * plugin. In browser applications, add {@linkcode DOMWindowPlugin} to bridge
 * native pointer events into those resources. This plugin requires
 * {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, {@linkcode MathPlugin}, and
 * {@linkcode WindowPlugin}; register those dependencies before running the app.
 * Required plugins are not installed automatically.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CommandsPlugin } from '@wimaengine/command'
 * import { CorePlugin } from '@wimaengine/core'
 * import { MathPlugin } from '@wimaengine/math'
 * import { Mouse, MouseButton, MouseButtons, MousePlugin } from '@wimaengine/mouse'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 * import { DOMWindowPlugin } from '@wimaengine/window-dom'
 * import { WindowPlugin } from '@wimaengine/window'
 *
 * const app = new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .registerPlugin(new MathPlugin())
 *   .registerPlugin(new CommandsPlugin())
 *   .registerPlugin(new WindowPlugin())
 *   .registerPlugin(new DOMWindowPlugin())
 *   .registerPlugin(new MousePlugin())
 * app.run()
 *
 * const world = app.getWorld()
 * const mouse = world.getResource(Mouse)
 * const buttons = world.getResource(MouseButtons)
 *
 * if (mouse.moved()) {
 *   console.log(mouse.position.x, mouse.position.y)
 * }
 *
 * if (buttons.justPressed(MouseButton.Left)) {
 *   console.log('left button pressed')
 * }
 * ```
 *
 * @category plugin
 */
export class MousePlugin extends Plugin {

  /**
   * Adds {@linkcode Mouse} and {@linkcode MouseButtons} resources to the app's
   * default world.
   *
   * The resources expose current mouse position, movement, and button
   * transitions from matching pointer events.
   *
   * @param {App} app - {@linkcode App} to configure.
   * @returns {void}
   */
  register(app) {

    app
      .setResource(new Mouse())
      .setResource(new MouseButtons())
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerMouseTypes })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateMouse })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateMouseButtons })
  }

  /**
   * Returns the plugin dependencies required by mouse input.
   *
   * Register {@linkcode CorePlugin}, {@linkcode ReflectPlugin}, {@linkcode MathPlugin},
   * and {@linkcode WindowPlugin} before this plugin. Registering
   * {@linkcode MousePlugin} does not install them automatically.
   *
   * @returns {TypeId[]} Required plugin {@linkcode TypeId} values.
   */
  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(MathPlugin), typeid(WindowPlugin)]
  }
}
/* eslint-enable jsdoc/check-tag-names */

/**
 * @param {World} world
 */
function updateMouse(world) {
  const mouse = world.getResource(Mouse)
  const moves = /** @type {Events<PointerMove>} */(world.getResourceByTypeId(typeidGeneric(Events, [PointerMove])))
  const wheels = /** @type {Events<PointerWheel>} */(world.getResourceByTypeId(typeidGeneric(Events, [PointerWheel])))

  /** @type {PointerMove | undefined} */
  let move

  moves.each((event) => {
    if (event.data.pointerType !== 'mouse') return

    move = event.data
  })

  mouse.delta.copy(Vector2.Zero)
  mouse.wheelDelta.copy(Vector3.Zero)
  mouse.lastPosition.copy(mouse.position)

  if (move) {
    mouse.delta.copy(move.delta)
    mouse.position.copy(move.position)
  }

  wheels.each((event) => {
    if (event.data.pointerType === 'mouse') Vector3.add(mouse.wheelDelta, event.data.delta, mouse.wheelDelta)
  })
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
