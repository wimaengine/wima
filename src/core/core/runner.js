/**
 * Default runner: drives all schedules from a single animation frame loop.
 * @type {import('../../schedule/index.js').Runner}
 */
export function defaultRunner(scheduler, world) {
  let tick = 0
  /** @type {Map<string, { active: boolean, nextRunAt: number }>} */
  const state = new Map()

  const now = performance.now()

  for (const executable of scheduler.values()) {
    state.set(executable.label, {
      active: true,
      nextRunAt: now + executable.delay
    })
  }

  const update = (/** @type {number} */ time) => {
    for (const executable of scheduler.values()) {
      const execState = state.get(executable.label)
      if (!execState || !execState.active) continue

      if (time >= execState.nextRunAt) {
        executable.schedule.run(world, executable.errorHandler)
        if (executable.repeat) {
          execState.nextRunAt = time + executable.delay
        } else {
          execState.active = false
        }
      }
    }

    tick = requestAnimationFrame(update)
  }

  tick = requestAnimationFrame(update)
}
