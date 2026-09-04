import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric } from '@wimaengine/type'
import { PointerCancel, PointerDown, PointerMove, PointerUp } from '@wimaengine/window'
import { WindowPlugin } from '@wimaengine/window'
import { TouchPointer } from './core'
import { Touches } from './resources'
import { registerTouchTypes } from './systems'
import { typeid } from '@wimaengine/type'

export class TouchPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.Start, system: updateTouch })
      .setResource(new Touches())
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerTouchTypes })
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(WindowPlugin)]
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
