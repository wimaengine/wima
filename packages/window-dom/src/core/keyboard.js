import { World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { typeidGeneric } from '@wimaengine/type'
import { KeyDown, KeyUp } from '@wimaengine/window'

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
