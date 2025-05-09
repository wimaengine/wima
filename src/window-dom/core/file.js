import { World } from '../../ecs/index.js'
import { FileDrop, FileDrag } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement } target
 */
export function setUpFileEvents(world, target) {
  target.addEventListener('dragover', (event) => {
    const dispatch = world.getResourceByName('events<filedrag>')

    dispatch.write(new FileDrag(event))
    event.preventDefault()
  })
  target.addEventListener('drop', (event) => {
    const dispatch = world.getResourceByName('events<filedrop>')

    dispatch.write(new FileDrop(event))
    event.preventDefault()
  })
}