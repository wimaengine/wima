import { World } from '../../ecs/index.js'
import { Events } from '../../event/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { TouchCancel, TouchEnd, TouchMove, TouchStart } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement } target
 */
export function setUpTouchEvents(world, target) {
  target.addEventListener('touchstart', (e) => {

    /** @type {Events<TouchStart>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [TouchStart]))

    for (let i = 0; i < e.changedTouches.length; i++) {
      dispatch.write(new TouchStart(e.changedTouches[i]))
    }
  })
  target.addEventListener('touchmove', (e) => {

    /** @type {Events<TouchMove>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [TouchMove]))
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      dispatch.write(new TouchMove(e.changedTouches[i]))
    }
  })
  target.addEventListener('touchcancel', (e) => {

    /** @type {Events<TouchCancel>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [TouchCancel]))

    for (let i = 0; i < e.changedTouches.length; i++) {
      dispatch.write(new TouchCancel(e.changedTouches[i]))
    }
  })
  target.addEventListener('touchend', (e) => {

    /** @type {Events<TouchEnd>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [TouchEnd]))

    for (let i = 0; i < e.changedTouches.length; i++) {
      dispatch.write(new TouchEnd(e.changedTouches[i]))
    }
  })
}