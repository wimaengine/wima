import { World } from '../../ecs/index.js'
import { Events } from '../../event/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { FileDrop, FileDrag } from '../../window/index.js'

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