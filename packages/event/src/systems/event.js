/** @import {SystemFunc} from '@wimaengine/ecs'*/
/** @import {TypeId} from '@wimaengine/type'*/
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
