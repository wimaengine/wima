
/** @import {ComponentHook} from '../../ecs/index.js' */
import { warn } from '../../logger/index.js'
import { Window, Windows } from '../../window/index.js'
import { setUpKeyboardEvents, setupMouseEvents, setUpTouchEvents, setUpWindowEvents, setUpFileEvents } from '../core/index.js'

/**
 * @type {ComponentHook}
 */
export function openWindow(entity, world) {

  // SAFETY: Component is guaranteed as this is its component hook
  const window = /** @type {Window}*/(world.get(entity, Window))
  const windows = world.getResource(Windows)
  let element

  if (window.selector) element = /** @type {HTMLElement | undefined}*/(document.querySelector(window.selector))
  if (!element) {
    element = document.createElement('canvas')
  }
  if (element.nodeName !== 'CANVAS') {
    element = document.createElement('canvas')
    warn(`The provided selector '${window.selector}' does not yield a canvas element.`)
  }
  
  const canvas = /** @type {HTMLCanvasElement}*/(element)

  windows.setWindow(entity, canvas)
  canvas.width = window.getWidth()
  canvas.height = window.getHeight()
  document.body.append(canvas)

  // setting tabindex and focus to enable keyboard events
  // on the canvas element.
  canvas.tabIndex = -1
  canvas.focus()
  
  setupMouseEvents(world, canvas)
  setUpTouchEvents(world, canvas)
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
  
  canvas.remove()
  windows.delete(entity)
}