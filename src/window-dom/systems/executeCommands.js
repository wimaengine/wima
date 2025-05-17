import { Query, World } from '../../ecs/index.js'
import { error } from '../../logger/index.js'
import { Window, WindowCommand, WindowCommands, WindowRequest, Windows } from '../../window/index.js'

/**
 * @param {World} world
 */
export function executeWindowCommands(world) {
  const commands = world.getResource(WindowCommands)
  const canvases = world.getResource(Windows)
  const windows = new Query(world, [Window])

  const buffer = commands.getBuffer()
  
  for (let i = 0; i < buffer.length; i++) {
    const command = buffer[i]
    const canvas = canvases.getWindow(command.entity)
    const [window] = /** @type {[Window]} */(windows.get(command.entity))

    execute(command, canvas, window)
  }

  commands.clear()
}

/**
 * @param {WindowCommand} command
 * @param {HTMLCanvasElement} canvas
 * @param {Window} window 
 */
function execute(command, canvas, window) {
  switch (command.type) {
    case WindowRequest.Resize:
      canvas.width = command.data.x
      canvas.height = command.data.y
      window.set(canvas.width, canvas.height)
      canvas.dispatchEvent(new Event('resize'))
      break

    case WindowRequest.Reposition:
      canvas.style.right = command.data.x
      canvas.style.left = command.data.y
      break

    case WindowRequest.PointerCapture:
      canvas.setPointerCapture(command.data.id)
      break

    case WindowRequest.PointerRelease:
      canvas.releasePointerCapture(command.data.id)
      break

    case WindowRequest.FullScreen:
      canvas.requestFullscreen()
      break

    case WindowRequest.PointerLock:
      canvas.requestPointerLock()
      break

    default:
      error('A `WindowRequest` variant has not been implemented')
  }
}