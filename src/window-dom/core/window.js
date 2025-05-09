import { World } from '../../ecs/index.js'
import { WindowResize } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement } target
 */
export function setUpWindowEvents(world, target) {
  target.addEventListener('resize', (event) => {
    const dispatch = world.getResourceByName('events<windowresize>')

    dispatch.write(new WindowResize(event))
  }) 
}