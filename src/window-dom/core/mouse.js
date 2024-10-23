import { World } from '../../ecs/index.js'
import { MouseDown, MouseUp, MouseMove, MouseWheel, MouseEnter, MouseLeave } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement} target 
 */
export function setupMouseEvents(world, target) {
  target.addEventListener('mousedown', (e) => {
    const dispatch = world.getResource('events<mousedown>')

    dispatch.write(new MouseDown(e))
  })
  target.addEventListener('mouseup', (e) => {
    const dispatch = world.getResource('events<mouseup>')

    dispatch.write(new MouseUp(e))
  })
  target.addEventListener('mousemove', (e) => {
    const dispatch = world.getResource('events<mousemove>')

    dispatch.write(new MouseMove(e))
  })
  target.addEventListener('wheel', (e) => {
    const dispatch = world.getResource('events<mousewheel>')

    dispatch.write(new MouseWheel(e))
  })
  target.addEventListener('mouseenter', (e) => {
    const dispatch = world.getResource('events<mouseenter>')

    dispatch.write(new MouseEnter(e))
  })
  target.addEventListener('mouseleave', (e) => {
    const dispatch = world.getResource('events<mouseleave>')

    dispatch.write(new MouseLeave(e))
  })
}