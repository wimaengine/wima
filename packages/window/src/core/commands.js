/** @import {EntityHandle, World} from '@wimaengine/ecs' */
import { CommandQueue } from '@wimaengine/command'
import { assert } from '@wimaengine/logger'
import { Vector2 } from '@wimaengine/math'
import { WindowCommand, WindowRequest } from '../commands'

export class WindowCommands {

  /**
   * @private
   * @type {EntityHandle | undefined}
   */
  entity

  /**
   * @private
   * @type {CommandQueue}
   */
  buffer

  /**
   * @param {World} [world]
   */
  constructor(world) {
    this.buffer = world.getResource(CommandQueue)
  }

  /**
   * @param {EntityHandle} entity
   */
  window(entity) {
    this.entity = entity

    return this
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    assert(this.entity, 'No window entity selected for resize')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.Resize, new Vector2(width, height)))

    return this
  }
  requestPointerLock() {
    assert(this.entity, 'No window entity selected for pointer lock')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.PointerLock, undefined))

    return this
  }
  requestPointerCapture() {
    assert(this.entity, 'No window entity selected for pointer capture')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.PointerCapture, undefined))

    return this
  }
  requestFullscreen() {
    assert(this.entity, 'No window entity selected for fullscreen')
    this.buffer.add(new WindowCommand(this.entity, WindowRequest.FullScreen, undefined))

    return this
  }
}
