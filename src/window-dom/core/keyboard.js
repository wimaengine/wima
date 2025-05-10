import { World } from '../../ecs/index.js'
import { KeyDown, KeyUp } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement } target
 */
export function setUpKeyboardEvents(world, target) {
  target.addEventListener('keyup', (event) => {
    const dispatch = world.getResourceByName('events<keyup>')

    dispatch.write(new KeyUp(event))
  })
  target.addEventListener('keydown', (event) => {
    const dispatch = world.getResourceByName('events<keydown>')

    dispatch.write(new KeyDown(event))
  })
}