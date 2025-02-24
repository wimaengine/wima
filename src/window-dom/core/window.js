import { World } from '../../ecs/index.js'
import { Events } from '../../event/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { WindowResize } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement } target
 */
export function setUpWindowEvents(world, target) {
  target.addEventListener('resize', (event) => {

    /** @type {Events<WindowResize>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [WindowResize]))

    dispatch.write(new WindowResize(event))
  }) 
}