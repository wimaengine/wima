import { World } from '../../ecs/index.js'
import { TouchCancel, TouchEnd, TouchMove, TouchStart } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement } target
 */
export function setUpTouchEvents(world, target) {
  target.addEventListener('touchstart', (e) => {
    const dispatch = world.getResourceByName('events<touchstart>')

    for (let i = 0; i < e.changedTouches.length; i++) {
      dispatch.write(new TouchStart(e.changedTouches[i]))
    }
  })
  target.addEventListener('touchmove', (e) => {
    const dispatch = world.getResourceByName('events<touchmove>')
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      dispatch.write(new TouchMove(e.changedTouches[i]))
    }
  })
  target.addEventListener('touchcancel', (e) => {
    const dispatch = world.getResourceByName('events<touchcancel>')

    for (let i = 0; i < e.changedTouches.length; i++) {
      dispatch.write(new TouchCancel(e.changedTouches[i]))
    }
  })
  target.addEventListener('touchend', (e) => {
    const dispatch = world.getResourceByName('events<touchend>')

    for (let i = 0; i < e.changedTouches.length; i++) {
      dispatch.write(new TouchEnd(e.changedTouches[i]))
    }
  })
}