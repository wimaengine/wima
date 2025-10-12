import { Query, World } from '../../ecs/index.js'
import { Timer } from '../components/index.js'
import { VirtualClock } from '../resource/index.js'

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
