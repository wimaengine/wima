import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { typeidGeneric } from '@wimaengine/type'
import { FileDrop, FileDrag } from '@wimaengine/window'

/**
 * @param {World} world
 * @param {HTMLElement } target
 */
export function setUpFileEvents(world, target) {
  target.addEventListener('dragover', (event) => {

    /** @type {Events<FileDrag>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [FileDrag]))

    dispatch.write(new FileDrag(event))
    event.preventDefault()
  })
  target.addEventListener('drop', (event) => {

    /** @type {Events<FileDrop>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [FileDrop]))

    dispatch.write(new FileDrop(event))
    event.preventDefault()
  })
}
