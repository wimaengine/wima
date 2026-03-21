/** @import {SystemFunc} from '../../ecs/index.js'*/
/** @import {TypeId} from '../../type/index.js'*/
/**
 * @param {TypeId} id
 * @returns {SystemFunc}
 */
export function makeEventClear(id) {
  return function clearEvents(world) {
    const dispatch = world.getResourceByTypeId(id)

    dispatch.clear()
  }
}