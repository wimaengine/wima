import { strictEqual, deepStrictEqual } from 'node:assert'
import { afterEach, describe, test, vi } from 'vitest'
import { World } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { CrossWorldSchedule, Executable, Scheduler } from '@wimaengine/schedule'
import { defaultRunner } from '../src/core/runner.js'

class TargetWorld { }
class SourceWorld { }
class NormalSchedule { }
class CrossWorldScheduleLabel { }

describe('Testing `defaultRunner`', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('runs crossworld schedules before normal schedules', () => {
    const scheduler = new Scheduler()
    const targetWorld = new World()
    const sourceWorld = new World()
    const worlds = new Map([
      [typeid(TargetWorld), targetWorld],
      [typeid(SourceWorld), sourceWorld]
    ])
    /** @type {string[]} */
    const order = []
    /** @type {((time: number) => void)[]} */
    const frames = []

    scheduler.set(new Executable({
      label: NormalSchedule,
      repeat: false,
      world: TargetWorld
    }))
    scheduler.setCrossWorld(new Executable({
      label: CrossWorldScheduleLabel,
      repeat: false,
      schedule: new CrossWorldSchedule(),
      world: TargetWorld,
      sourceWorld: SourceWorld
    }))

    const normalSchedule = scheduler.get(NormalSchedule)
    if (!normalSchedule) {
      throw new Error('The normal schedule was not created.')
    }

    normalSchedule.add(() => {
      order.push('normal')
    })

    const crossWorldSchedule = scheduler.getCrossWorld(CrossWorldScheduleLabel)
    if (!crossWorldSchedule) {
      throw new Error('The crossworld schedule was not created.')
    }

    crossWorldSchedule.add((target, source) => {
      strictEqual(target, targetWorld)
      strictEqual(source, sourceWorld)
      order.push('crossworld')
    })

    vi.stubGlobal('performance', {
      now: () => 0
    })
    vi.stubGlobal('requestAnimationFrame', (callback) => {
      frames.push(callback)
      return 0
    })

    defaultRunner(scheduler, worlds)

    const frame = frames.shift()

    if (!frame) {
      throw new Error('The animation frame callback was not scheduled.')
    }

    frame(0)

    deepStrictEqual(order, ['crossworld', 'normal'])
  })
})
