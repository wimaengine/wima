/** @import {SystemFunc} from '../../ecs/index.js'*/
/**
 * @param {string} name 
 * @returns {SystemFunc}
 */
export function makeEventClear(name) {
  return function clearEvents(world) {
    const dispatch = world.getResource(name)

    dispatch.clear()
  }
}