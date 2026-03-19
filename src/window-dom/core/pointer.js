import { World } from '../../ecs/index.js'
import { Events } from '../../event/index.js'
import { typeidGeneric } from '../../type/index.js'
import {
  PointerDown,
  PointerUp,
  PointerMove,
  PointerCancel,
  PointerEnter,
  PointerLeave,
  PointerWheel
} from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement} target
 */
export function setupPointerEvents(world, target) {
  target.addEventListener('pointerdown', (e) => {

    /** @type {Events<PointerDown>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerDown]))

    dispatch.write(new PointerDown(e))
  })
  target.addEventListener('pointerup', (e) => {

    /** @type {Events<PointerUp>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerUp]))

    dispatch.write(new PointerUp(e))
  })
  target.addEventListener('pointermove', (e) => {

    /** @type {Events<PointerMove>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerMove]))

    dispatch.write(new PointerMove(e))
  })
  target.addEventListener('pointercancel', (e) => {

    /** @type {Events<PointerCancel>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerCancel]))

    dispatch.write(new PointerCancel(e))
  })
  target.addEventListener('pointerenter', (e) => {

    /** @type {Events<PointerEnter>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerEnter]))

    dispatch.write(new PointerEnter(e))
  })
  target.addEventListener('pointerleave', (e) => {

    /** @type {Events<PointerLeave>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerLeave]))

    dispatch.write(new PointerLeave(e))
  })

  // Wheel has no pointer event equivalent; keep it here for input support.
  target.addEventListener('wheel', (e) => {

    /** @type {Events<PointerWheel>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [PointerWheel]))

    dispatch.write(new PointerWheel(e))
  })
}
