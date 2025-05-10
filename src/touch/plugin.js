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
  const touch = world.getResource(Touches)

  /** @type {EventDispatch<TouchStart>} */
  const start = world.getResourceByName('events<touchstart>')

  /** @type {EventDispatch<TouchMove>} */
  const move = world.getResourceByName('events<touchmove>')

  /** @type {EventDispatch<TouchEnd>} */
  const end = world.getResourceByName('events<touchend>')

  /** @type {EventDispatch<TouchCancel>} */
  const cancel = world.getResourceByName('events<touchcancel>')  

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