import { App, AppSchedule } from '../app/index.js'
import { World } from '../ecs/index.js'
import { EventDispatch } from '../event/index.js'
import { TouchCancel, TouchEnd, TouchMove, TouchStart } from '../window/index.js'
import { TouchPointer } from './core/index.js'
import { Touches } from './resources/touches.js'

export class TouchPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem(AppSchedule.Update, updateTouch)
      .setResource(new Touches())
  }
}


/**
 * @param {World} world
 */
function updateTouch(world) {

  /** @type {Touches} */
  const touch = world.getResource('touches')

  /** @type {EventDispatch<TouchStart>} */
  const start = world.getResource('events<touchstart>')

  /** @type {EventDispatch<TouchMove>} */
  const move = world.getResource('events<touchmove>')

  /** @type {EventDispatch<TouchEnd>} */
  const end = world.getResource('events<touchend>')

  /** @type {EventDispatch<TouchCancel>} */
  const cancel = world.getResource('events<touchcancel>')  

  start.each((event) => {
    const { data } = event
    const { id } = data
    const pointer = new TouchPointer(id)

    pointer.position.copy(data.position)
    pointer.lastposition.copy(pointer.position)

    touch.set(id, pointer)
  })

  move.each((event) => {
    const { data } = event
    const { id } = data
    const pointer = touch.get(id)

    if (!pointer) return

    pointer.lastposition.copy(pointer.position)
    pointer.position.copy(data.position)
  })

  end.each((event) => {
    const { id } = event.data

    touch.set(id, null)
  })
  cancel.each((event) => {
    const { id } = event.data

    touch.set(id, null)
  })
}