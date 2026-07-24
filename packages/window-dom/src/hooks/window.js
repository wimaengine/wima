
/** @import {ComponentHook} from '@wimaengine/ecs' */
import { warn } from '@wimaengine/logger'
import { Window, Windows } from '@wimaengine/window'
import { setUpKeyboardEvents, setupPointerEvents, setUpFileEvents } from '../core'

/**
 * @type {ComponentHook}
 */
export function openWindow(entity, world) {

  // SAFETY: Component is guaranteed as this is its component hook
  const window = /** @type {Window}*/(world.get(entity, Window))

  if (window.selector) {
    const canvas = document.querySelector(window.selector)

    if (canvas instanceof HTMLCanvasElement) {
      registerWindow(world, entity, canvas, window)

      return
    }

    warn(`The provided selector '${window.selector}' does not yield a canvas element.`)

  }

  const canvas = document.createElement('canvas')

  document.body.append(canvas)
  registerWindow(world, entity, canvas, window)
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Window} window
 */
function syncWindowSize(canvas, window) {
  canvas.width = window.getWidth()
  canvas.height = window.getHeight()
  canvas.style.width = `${canvas.width}px`
  canvas.style.height = `${canvas.height}px`

  const rect = canvas.getBoundingClientRect()
  const width = Math.round(rect.width) || canvas.width
  const height = Math.round(rect.height) || canvas.height

  canvas.width = width
  canvas.height = height
  window.set(width, height)
}

/**
 * @param {import("@wimaengine/ecs").World} world
 * @param {import("@wimaengine/ecs").EntityHandle} entity
 * @param {HTMLCanvasElement} canvas
 * @param {Window} window
 */
function registerWindow(world, entity, canvas, window) {
  const windows = world.getResource(Windows)

  syncWindowSize(canvas, window)
  windows.setWindow(entity, canvas)

  // setting tabindex and focus to enable keyboard events
  // on the canvas element.
  canvas.tabIndex = -1
  canvas.focus()

  setupPointerEvents(world, canvas)
  setUpKeyboardEvents(world, canvas)
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
