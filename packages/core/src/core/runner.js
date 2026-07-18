import { assert } from '@wimaengine/logger'
import { typeid } from '@wimaengine/type'

/**
 * Default runner: drives all schedules from a single animation frame loop and resolves each executable's world on demand.
 * @type {import('@wimaengine/schedule').Runner}
 */
export function defaultRunner(scheduler, worlds) {

  /** @type {Map<string, { active: boolean, nextRunAt: number }>} */
  const crossWorldState = new Map()

  /** @type {Map<string, { active: boolean, nextRunAt: number }>} */
  const state = new Map()

  const now = performance.now()

  for (const executable of scheduler.crossWorldValues()) {
    crossWorldState.set(executable.typeId, {
      active: true,
      nextRunAt: now + executable.delay
    })
  }

  for (const executable of scheduler.values()) {
    state.set(executable.typeId, {
      active: true,
      nextRunAt: now + executable.delay
    })
  }

  const update = (/** @type {number} */ time) => {
    for (const executable of scheduler.crossWorldValues()) {
      const execState = crossWorldState.get(executable.typeId)

      if (!execState || !execState.active) continue

      if (time >= execState.nextRunAt) {
        const targetTypeId = typeid(executable.world)
        const targetWorld = worlds.get(targetTypeId)

        assert(targetWorld, `The world \`${targetTypeId}\` does not exist.`)

        const sourceTypeId = typeid(executable.sourceWorld)
        const sourceWorld = worlds.get(sourceTypeId)

        assert(sourceWorld, `The source world \`${sourceTypeId}\` does not exist.`)

        executable.schedule.run(targetWorld, sourceWorld, executable.errorHandler)

        if (executable.repeat) {
          execState.nextRunAt = time + executable.delay
        } else {
          execState.active = false
        }
      }
    }

    for (const executable of scheduler.values()) {
      const execState = state.get(executable.typeId)

      if (!execState || !execState.active) continue

      if (time >= execState.nextRunAt) {
        const targetTypeId = typeid(executable.world)
        const world = worlds.get(targetTypeId)

        assert(world, `The world \`${targetTypeId}\` does not exist.`)

        executable.schedule.run(world, executable.errorHandler)

        if (executable.repeat) {
          execState.nextRunAt = time + executable.delay
        } else {
          execState.active = false
        }
      }
    }

    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}
