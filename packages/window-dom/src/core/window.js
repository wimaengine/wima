import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { typeidGeneric } from '@wimaengine/type'
import { WindowResize } from '@wimaengine/window'

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
