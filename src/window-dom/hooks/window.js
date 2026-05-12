
/** @import {ComponentHook} from '../../ecs/index.js' */
import { warn } from '../../logger/index.js'
import { Window, Windows } from '../../window/index.js'
import { setUpKeyboardEvents, setupPointerEvents, setUpWindowEvents, setUpFileEvents } from '../core/index.js'

/**
 * @type {ComponentHook}
 */
export function openWindow(entity, world) {

  // SAFETY: Component is guaranteed as this is its component hook
  const window = /** @type {Window}*/(world.get(entity, Window))

  if (window.selector) {
    const canvas = document.querySelector(window.selector)
    if (canvas instanceof HTMLCanvasElement) {
      registerWindow(world,entity, canvas, window)
      return
    } else {
      warn(`The provided selector '${window.selector}' does not yield a canvas element.`)
    }
  }

  const canvas = document.createElement('canvas')

  document.body.append(canvas)
  registerWindow(world,entity, canvas, window)
}

/**
 * @param {import("../../ecs/registry.js").World} world
 * @param {import("../../ecs/index.js").Entity} entity
 * @param {HTMLCanvasElement} canvas
 * @param {Window} window
 */
function registerWindow(world, entity, canvas, window){
  const windows = world.getResource(Windows)
  
  canvas.width = window.getWidth()
  canvas.height = window.getHeight()
  windows.setWindow(entity, canvas)
  // setting tabindex and focus to enable keyboard events
  // on the canvas element.
  canvas.tabIndex = -1
  canvas.focus()

  setupPointerEvents(world, canvas)
  setUpKeyboardEvents(world, canvas)
  setUpWindowEvents(world, canvas)
  setUpFileEvents(world, canvas)
}
/**
 * @type {ComponentHook}
 */
export function closeWindow(entity, world) {
  const windows = world.getResource(Windows)
  const canvas = windows.getWindow(entity)

  if (!canvas) return

  canvas.remove()
  windows.delete(entity)
}
