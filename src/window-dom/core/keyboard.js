import { World } from '../../ecs/index.js'
import { Events } from '../../event/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { KeyDown, KeyUp } from '../../window/index.js'

/**
 * @param {World} world
 * @param {HTMLElement } target
 */
export function setUpKeyboardEvents(world, target) {
  target.addEventListener('keyup', (event) => {

    /** @type {Events<KeyUp>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [KeyUp]))

    dispatch.write(new KeyUp(event))
  })
  target.addEventListener('keydown', (event) => {

    /** @type {Events<KeyDown>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [KeyDown]))

    dispatch.write(new KeyDown(event))
  })
}