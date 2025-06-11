import { World } from '../../ecs/index.js'
import { Events } from '../../event/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { MouseDown, MouseUp, MouseMove, MouseWheel, MouseEnter, MouseLeave } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement} target 
 */
export function setupMouseEvents(world, target) {
  target.addEventListener('mousedown', (e) => {

    /** @type {Events<MouseDown>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [MouseDown]))

    dispatch.write(new MouseDown(e))
  })
  target.addEventListener('mouseup', (e) => {

    /** @type {Events<MouseUp>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [MouseUp]))

    dispatch.write(new MouseUp(e))
  })
  target.addEventListener('mousemove', (e) => {

    /** @type {Events<MouseMove>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [MouseMove]))

    dispatch.write(new MouseMove(e))
  })
  target.addEventListener('wheel', (e) => {

    /** @type {Events<MouseWheel>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [MouseWheel]))

    dispatch.write(new MouseWheel(e))
  })
  target.addEventListener('mouseenter', (e) => {

    /** @type {Events<MouseEnter>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [MouseEnter]))

    dispatch.write(new MouseEnter(e))
  })
  target.addEventListener('mouseleave', (e) => {

    /** @type {Events<MouseLeave>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [MouseLeave]))

    dispatch.write(new MouseLeave(e))
  })
}