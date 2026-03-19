import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { World } from '../ecs/index.js'
import { Events } from '../event/index.js'
import { typeidGeneric } from '../type/index.js'
import { PointerCancel, PointerDown, PointerMove, PointerUp } from '../window/index.js'
import { TouchPointer } from './core/index.js'
import { Touches } from './resources/touches.js'

export class TouchPlugin extends Plugin {

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

  /** @type {Events<PointerDown>} */
  const start = world.getResourceByTypeId(typeidGeneric(Events, [PointerDown]))

  /** @type {Events<PointerMove>} */
  const move = world.getResourceByTypeId(typeidGeneric(Events, [PointerMove]))

  /** @type {Events<PointerUp>} */
  const end = world.getResourceByTypeId(typeidGeneric(Events, [PointerUp]))

  /** @type {Events<PointerCancel>} */
  const cancel = world.getResourceByTypeId(typeidGeneric(Events, [PointerCancel]))

  start.each((event) => {
    const { data } = event

    if (data.pointerType !== 'touch') return

    const pointer = new TouchPointer(0)

    pointer.position.copy(data.position)
    pointer.lastposition.copy(pointer.position)

    touch.set(data.id, pointer)
  })

  move.each((event) => {
    const { data } = event

    if (data.pointerType !== 'touch') return

    const id = touch.getId(data.id)

    if (!id) return

    const pointer = touch.get(id)

    if (!pointer) return

    pointer.lastposition.copy(pointer.position)
    pointer.position.copy(data.position)
  })

  end.each((event) => {
    const { data } = event

    if (data.pointerType !== 'touch') return

    touch.delete(data.id)
  })
  cancel.each((event) => {
    const { data } = event

    if (data.pointerType !== 'touch') return

    touch.delete(data.id)
  })
}
