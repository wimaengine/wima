/** @import {Entity, World} from '../../ecs/index.js' */
import { CommandQueue } from '../../command/index.js'
import { assert } from '../../logger/index.js'
import { Vector2 } from '../../math/index.js'
import { WindowCommand } from '../commands/index.js'
import { WindowRequest } from './request.js'

export class WindowCommands {

  /**
   * @private
   * @type {Entity | undefined}
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
  constructor(world){
    this.buffer = world.getResource(CommandQueue)
  }

  /**
   * @param {Entity} entity
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
