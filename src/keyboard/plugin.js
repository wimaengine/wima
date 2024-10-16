import { App, AppSchedule } from '../app/index.js'
import { Keyboard } from './resources/index.js'
import { KeyUp, KeyDown } from '../window/index.js'
import { EventDispatch } from '../event/index.js'
import { World } from '../ecs/index.js'
import { KeyCode } from './core/key.js'

export class KeyboardPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Keyboard())
      .registerSystem(AppSchedule.Update, updateKeyBoard)
  }
}

/**
 * @param {World} world
 */
function updateKeyBoard(world) {

  /** @type {Keyboard}*/
  const keyboard = world.getResource('keyboard')

  /** @type {EventDispatch<KeyDown>}*/
  const down = world.getResource('events<keydown>')

  /** @type {EventDispatch<KeyUp>}*/
  const up = world.getResource('events<keyup>')

  keyboard.clearJustPressed()
  keyboard.clearJustReleased()

  down.each((event) => {
    const button = mapKeyBoardButtons(event.data.code)

    if (button === KeyCode.Unidentified) console.log(event.data.code)

    keyboard.press(button)
  })

  up.each((event) => {
    const button = mapKeyBoardButtons(event.data.code)

    keyboard.release(button)
  })
}

/**
 * @param {string} keycode
 */
function mapKeyBoardButtons(keycode) {
  switch (keycode) {
    case 'KeyA':
      return KeyCode.KeyA

    case 'KeyB':
      return KeyCode.KeyB

    case 'KeyC':
      return KeyCode.KeyC

    case 'KeyD':
      return KeyCode.KeyD

    case 'KeyE':
      return KeyCode.KeyE

    case 'KeyF':
      return KeyCode.KeyF

    case 'KeyG':
      return KeyCode.KeyG

    case 'KeyH':
      return KeyCode.KeyH

    case 'KeyI':
      return KeyCode.KeyI

    case 'KeyJ':
      return KeyCode.KeyJ

    case 'KeyK':
      return KeyCode.KeyK

    case 'KeyL':
      return KeyCode.KeyL

    case 'KeyM':
      return KeyCode.KeyM

    case 'KeyN':
      return KeyCode.KeyN

    case 'KeyO':
      return KeyCode.KeyO

    case 'KeyP':
      return KeyCode.KeyP

    case 'KeyQ':
      return KeyCode.KeyQ

    case 'KeyR':
      return KeyCode.KeyR

    case 'KeyS':
      return KeyCode.KeyS

    case 'KeyT':
      return KeyCode.KeyT

    case 'KeyU':
      return KeyCode.KeyU

    case 'KeyV':
      return KeyCode.KeyV

    case 'KeyW':
      return KeyCode.KeyW

    case 'KeyX':
      return KeyCode.KeyX

    case 'KeyY':
      return KeyCode.KeyY

    case 'KeyZ':
      return KeyCode.KeyZ

    case 'Digit1':
      return KeyCode.Digit1

    case 'Digit2':
      return KeyCode.Digit2

    case 'Digit3':
      return KeyCode.Digit3

    case 'Digit4':
      return KeyCode.Digit4

    case 'Digit5':
      return KeyCode.Digit5

    case 'Digit6':
      return KeyCode.Digit6

    case 'Digit7':
      return KeyCode.Digit7

    case 'Digit8':
      return KeyCode.Digit8

    case 'Digit9':
      return KeyCode.Digit9

    case 'Digit0':
      return KeyCode.Digit0

    case 'Numpad1':
      return KeyCode.Numpad1

    case 'Numpad2':
      return KeyCode.Numpad2

    case 'Numpad3':
      return KeyCode.Numpad3

    case 'Numpad4':
      return KeyCode.Numpad4

    case 'Numpad5':
      return KeyCode.Numpad5

    case 'Numpad6':
      return KeyCode.Numpad6

    case 'Numpad7':
      return KeyCode.Numpad7

    case 'Numpad8':
      return KeyCode.Numpad8

    case 'Numpad9':
      return KeyCode.Numpad9

    case 'Numpad0':
      return KeyCode.Numpad0

    case 'NumpadAdd':
      return KeyCode.NumpadAdd

    case 'NumpadSubtract':
      return KeyCode.NumpadSubtract

    case 'NumpadMultiply':
      return KeyCode.NumpadMultiply

    case 'NumpadDivide':
      return KeyCode.NumpadDivide

    case 'NumpadDecimal':
      return KeyCode.NumpadDecimal

    case 'NumpadEnter':
      return KeyCode.NumpadEnter

    case 'F1':
      return KeyCode.F1

    case 'F2':
      return KeyCode.F2

    case 'F3':
      return KeyCode.F3

    case 'F4':
      return KeyCode.F4

    case 'F5':
      return KeyCode.F5

    case 'F6':
      return KeyCode.F6

    case 'F7':
      return KeyCode.F7

    case 'F8':
      return KeyCode.F8

    case 'F9':
      return KeyCode.F9

    case 'F10':
      return KeyCode.F10

    case 'F11':
      return KeyCode.F11

    case 'F12':
      return KeyCode.F12

    case 'Help':
      return KeyCode.Help

    case 'Home':
      return KeyCode.Home

    case 'Insert':
      return KeyCode.Insert

    case 'Delete':
      return KeyCode.Delete

    case 'End':
      return KeyCode.End

    case 'PageUp':
      return KeyCode.PageUp

    case 'PageDown':
      return KeyCode.PageDown

    case 'Tab':
      return KeyCode.Tab

    case 'Backspace':
      return KeyCode.BackSpace

    case 'CapsLock':
      return KeyCode.Capslock

    case 'Escape':
      return KeyCode.Escape

    case 'Enter':
      return KeyCode.Enter

    case 'ShiftLeft':
      return KeyCode.ShiftLeft

    case 'ShiftRight':
      return KeyCode.ShiftRight

    case 'ControlLeft':
      return KeyCode.ControlLeft

    case 'ControlRight':
      return KeyCode.ControlRight

    case 'MetaLeft':
      return KeyCode.MetaLeft

    case 'MetaRight':
      return KeyCode.MetaRight

    case 'AltLeft':
      return KeyCode.AltLeft

    case 'AltRight':
      return KeyCode.AltRight

    case 'ContextMenu':
      return KeyCode.ContextMenu

    case 'ArrowUp':
      return KeyCode.ArrowUp

    case 'ArrowDown':
      return KeyCode.ArrowDown

    case 'ArrowRight':
      return KeyCode.ArrowRight

    case 'ArrowLeft':
      return KeyCode.ArrowLeft

    case 'AltRight':
      return KeyCode.AltRight

    case 'AltRight':
      return KeyCode.AltRight

    case 'AltRight':
      return KeyCode.AltRight

    default:
      return KeyCode.Unidentified
  }
}