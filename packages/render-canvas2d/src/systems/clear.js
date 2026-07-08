/** @import {SystemFunc} from '@wimaengine/ecs' */
import { EntityHandle, Query } from '@wimaengine/ecs'
import { warn } from '@wimaengine/logger'
import { MainWindow, Windows, Window } from '@wimaengine/window'

/**
 * Clears the active canvas2d frame before the main render systems run.
 *
 * @type {SystemFunc}
 */
export function clearCanvas2d(world) {
  const windows = new Query(world, [EntityHandle, Window, MainWindow])
  const canvases = world.getResource(Windows)
  const window = windows.single()

  if (!window) return warn('Please define the main window before.')

  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const ctx = canvas.getContext('2d')

  if (!ctx) return warn('2d context could not be created on the canvas.')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
