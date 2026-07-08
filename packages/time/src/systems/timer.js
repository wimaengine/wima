import { Query, World } from '@wimaengine/ecs'
import { Timer } from '../components'
import { VirtualClock } from '../resource'

/**
 * @param {World} world
 */
export function updateTimers(world) {
  const timers = new Query(world, [Timer])
  const clock = world.getResource(VirtualClock)
  const delta = clock.getDelta()

  timers.each(([timer]) => {
    timer.update(delta)
  })
}
