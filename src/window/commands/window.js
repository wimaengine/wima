import { Query,Entity, World } from '../../ecs/index.js'
import { Command } from '../../command/index.js'
import { error } from '../../logger/index.js'
import { WindowRequest } from '../core/index.js'
import { Windows } from '../resources/index.js'
import { Window } from '../components/index.js'

export class WindowCommand extends Command {

  /**
   * @readonly
   * @type {Entity}
   */
  entity

  /**
   * @readonly
   * @type {WindowRequest}
   */
  type

  /**
   * @readonly
   * @type {any}
   */
  data

  /**
   * @param {Entity} entity
   * @param {WindowRequest} type
   * @param {any} data
   */
  constructor(entity, type, data) {
    super()
    this.entity = entity
    this.type = type
    this.data = data
  }

  /**
   * @param {World} world
   */
  execute(world){
  const canvases = world.getResource(Windows)
  const windows = new Query(world, [Window])
  const canvas = canvases.getWindow(this.entity)

  if (!canvas) return

  const [window] = /** @type {[Window]} */(windows.get(this.entity))

  execute(this, canvas, window)
  }
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
