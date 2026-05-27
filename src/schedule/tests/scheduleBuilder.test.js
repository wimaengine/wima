import { describe, test } from 'node:test'
import { deepStrictEqual, throws } from 'node:assert'
import { World } from '../../ecs/index.js'
import { Executable, Scheduler, SchedulerBuilder } from '../index.js'

class Phase { }
class Startup { }
class Update { }
class ParentPhase { }
class ChildPhase { }
class MissingPhase { }
class DefaultPhase { }
class AlternatePhase { }
class FencePhase { }

describe('Testing `SchedulerBuilder`', () => {
  test('creates schedule executables from builder configs', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []

    function tick() { order.push('tick') }

    builder.addSchedule({
      label: Update,
      repeat: false
    })
    builder.add({
      schedule: Update,
      system: tick
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['tick'])
  })

  test('sorts systems topologically from their `before` and `after` labels', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []
    function late() { order.push('late') }
    function early() { order.push('early') }
    function middle() { order.push('middle') }

    scheduler.set(new Executable({ label: Update }))

    builder.add({
      schedule: Update,
      after: [middle],
      system: late
    })
    builder.add({
      schedule: Update,
      before: ['middle'],
      system: early
    })
    builder.add({
      schedule: Update,
      system: middle
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['early', 'middle', 'late'])
  })

  test('prefers explicit system labels over function names', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []
    function systemA() { order.push('a') }
    function systemB() { order.push('b') }

    scheduler.set(new Executable({ label: Update }))

    builder.add({
      label: 'first',
      schedule: Update,
      system: systemA
    })
    builder.add({
      schedule: Update,
      after: ['first'],
      system: systemB
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['a', 'b'])
  })

  test('expands groups per schedule without label overlap', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const startupOrder = []
    /** @type {string[]} */
    const updateOrder = []
    function boot() { startupOrder.push('boot') }
    function register() { startupOrder.push('register') }
    function simulate() { updateOrder.push('simulate') }
    function input() { updateOrder.push('input') }
    function render() { updateOrder.push('render') }

    scheduler.set(new Executable({ label: Startup }))
    scheduler.set(new Executable({ label: Update }))

    builder.addGroup({
      label: Phase,
      schedule: Startup
    })
    builder.add({
      schedule: Startup,
      before: [Phase],
      system: boot
    })
    builder.add({
      schedule: Startup,
      systemGroup: Phase,
      system: register
    })

    builder.addGroup({
      label: Phase,
      schedule: Update,
      after: ['input']
    })
    builder.add({
      schedule: Update,
      systemGroup: Phase,
      before: [render],
      system: simulate
    })
    builder.add({
      schedule: Update,
      system: input
    })
    builder.add({
      schedule: Update,
      systemGroup: Phase,
      system: render
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Startup)?.run(world)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(startupOrder, ['boot', 'register'])
    deepStrictEqual(updateOrder, ['input', 'simulate', 'render'])
  })

  test('orders systems around a group label', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []

    class Phase { }

    function prepare() { order.push('prepare') }
    function first() { order.push('first') }
    function second() { order.push('second') }
    function finish() { order.push('finish') }

    scheduler.set(new Executable({ label: Update }))

    builder.addGroup({
      label: Phase,
      schedule: Update,
      after: ['prepare'],
      before: ['finish']
    })
    builder.add({
      schedule: Update,
      system: prepare
    })
    builder.add({
      schedule: Update,
      systemGroup: Phase,
      system: first
    })
    builder.add({
      schedule: Update,
      systemGroup: Phase,
      after: [first],
      system: second
    })
    builder.add({
      schedule: Update,
      system: finish
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['prepare', 'first', 'second', 'finish'])
  })

  test('uses the schedule default system group when a system omits one', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []

    function explicit() { order.push('explicit') }
    function implicit() { order.push('implicit') }
    function other() { order.push('other') }

    scheduler.set(new Executable({
      label: Update,
      defaultSystemGroup: DefaultPhase
    }))

    builder.addGroup({
      label: DefaultPhase,
      schedule: Update,
      before: [AlternatePhase]
    })
    builder.addGroup({
      label: AlternatePhase,
      schedule: Update
    })
    builder.add({
      schedule: Update,
      systemGroup: DefaultPhase,
      system: explicit
    })
    builder.add({
      schedule: Update,
      system: implicit
    })
    builder.add({
      schedule: Update,
      systemGroup: AlternatePhase,
      system: other
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['explicit', 'implicit', 'other'])
  })

  test('prefers an explicit system group over the schedule default', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []

    function explicit() { order.push('explicit') }
    function implicit() { order.push('implicit') }
    function fence() { order.push('fence') }

    scheduler.set(new Executable({
      label: Update,
      defaultSystemGroup: DefaultPhase
    }))

    builder.addGroup({
      label: DefaultPhase,
      schedule: Update,
      before: [FencePhase]
    })
    builder.addGroup({
      label: AlternatePhase,
      schedule: Update,
      after: [FencePhase]
    })
    builder.addGroup({
      label: FencePhase,
      schedule: Update
    })
    builder.add({
      schedule: Update,
      system: implicit
    })
    builder.add({
      schedule: Update,
      systemGroup: AlternatePhase,
      system: explicit
    })
    builder.add({
      schedule: Update,
      systemGroup: FencePhase,
      system: fence
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['implicit', 'fence', 'explicit'])
  })

  test('orders groups relative to other groups', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []

    class EarlyPhase { }
    class LatePhase { }

    function earlyOne() { order.push('earlyOne') }
    function earlyTwo() { order.push('earlyTwo') }
    function lateOne() { order.push('lateOne') }
    function lateTwo() { order.push('lateTwo') }

    scheduler.set(new Executable({ label: Update }))

    builder.addGroup({
      label: EarlyPhase,
      schedule: Update,
      before: [LatePhase]
    })
    builder.addGroup({
      label: LatePhase,
      schedule: Update
    })
    builder.add({
      schedule: Update,
      systemGroup: EarlyPhase,
      system: earlyOne
    })
    builder.add({
      schedule: Update,
      systemGroup: EarlyPhase,
      after: [earlyOne],
      system: earlyTwo
    })
    builder.add({
      schedule: Update,
      systemGroup: LatePhase,
      system: lateOne
    })
    builder.add({
      schedule: Update,
      systemGroup: LatePhase,
      after: [lateOne],
      system: lateTwo
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['earlyOne', 'earlyTwo', 'lateOne', 'lateTwo'])
  })

  test('treats empty groups as ordering barriers', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []

    class StartPhase { }
    class MiddlePhase { }
    class EndPhase { }

    function startSystem() { order.push('start') }
    function endSystem() { order.push('end') }

    scheduler.set(new Executable({ label: Update }))

    builder.addGroup({
      label: StartPhase,
      schedule: Update,
      before: [MiddlePhase]
    })
    builder.addGroup({
      label: MiddlePhase,
      schedule: Update,
      before: [EndPhase]
    })
    builder.addGroup({
      label: EndPhase,
      schedule: Update
    })
    builder.add({
      schedule: Update,
      systemGroup: EndPhase,
      system: endSystem
    })
    builder.add({
      schedule: Update,
      systemGroup: StartPhase,
      system: startSystem
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['start', 'end'])
  })

  test('inherits parent ordering constraints across descendants', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []

    class RootPhase { }
    class NestedPhase { }

    function head() { order.push('head') }
    function middle() { order.push('middle') }
    function tail() { order.push('tail') }
    function nested() { order.push('nested') }

    scheduler.set(new Executable({ label: Update }))

    builder.addGroup({
      label: RootPhase,
      schedule: Update,
      after: [head],
      before: [middle, tail]
    })
    builder.addGroup({
      label: NestedPhase,
      parent: RootPhase,
      schedule: Update
    })
    builder.add({
      schedule: Update,
      system: head
    })
    builder.add({
      schedule: Update,
      before: [tail],
      system: middle
    })
    builder.add({
      schedule: Update,
      systemGroup: NestedPhase,
      system: nested
    })
    builder.add({
      schedule: Update,
      system: tail
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['head', 'nested', 'middle', 'tail'])
  })

  test('combines inherited constraints from multiple ancestors', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const order = []

    class GrandPhase { }
    class ParentPhase { }
    class ChildPhase { }

    function head() { order.push('head') }
    function middle() { order.push('middle') }
    function tail() { order.push('tail') }
    function nested() { order.push('nested') }

    scheduler.set(new Executable({ label: Update }))

    builder.addGroup({
      label: GrandPhase,
      schedule: Update,
      before: [tail]
    })
    builder.addGroup({
      label: ParentPhase,
      parent: GrandPhase,
      schedule: Update,
      after: [head],
      before: [middle]
    })
    builder.addGroup({
      label: ChildPhase,
      parent: ParentPhase,
      schedule: Update
    })
    builder.add({
      schedule: Update,
      system: head
    })
    builder.add({
      schedule: Update,
      before: [tail],
      system: middle
    })
    builder.add({
      schedule: Update,
      systemGroup: ChildPhase,
      system: nested
    })
    builder.add({
      schedule: Update,
      system: tail
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(order, ['head', 'nested', 'middle', 'tail'])
  })

  test('keeps schedules isolated from each other', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    const world = new World()
    /** @type {string[]} */
    const startupOrder = []
    /** @type {string[]} */
    const updateOrder = []

    function sharedStartup() { startupOrder.push('sharedStartup') }
    function sharedUpdate() { updateOrder.push('sharedUpdate') }

    scheduler.set(new Executable({ label: Startup }))
    scheduler.set(new Executable({ label: Update }))

    builder.add({
      schedule: Startup,
      label: 'shared',
      system: sharedStartup
    })
    builder.add({
      schedule: Update,
      label: 'shared',
      system: sharedUpdate
    })

    builder.pushToScheduler(scheduler)
    scheduler.get(Startup)?.run(world)
    scheduler.get(Update)?.run(world)

    deepStrictEqual(startupOrder, ['sharedStartup'])
    deepStrictEqual(updateOrder, ['sharedUpdate'])
  })

  test('rejects duplicate system labels on the same schedule', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()

    scheduler.set(new Executable({ label: Update }))
    builder.add({
      schedule: Update,
      label: 'duplicate',
      system: () => { }
    })
    builder.add({
      schedule: Update,
      label: 'duplicate',
      system: () => { }
    })

    throws(() => builder.pushToScheduler(scheduler), /Duplicate system label/)
  })

  test('rejects duplicate group labels on the same schedule', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()

    scheduler.set(new Executable({ label: Update }))
    builder.addGroup({
      label: Phase,
      schedule: Update
    })
    builder.addGroup({
      label: Phase,
      schedule: Update
    })

    throws(() => builder.pushToScheduler(scheduler), /Duplicate system group label/)
  })

  test('rejects schedules that are missing from the scheduler', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()

    builder.add({
      schedule: Update,
      system: () => { }
    })

    throws(() => builder.pushToScheduler(scheduler), /The schedule label "Update" is not set/)
  })

  test('requires system groups to be registered explicitly', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()

    scheduler.set(new Executable({ label: Update }))
    builder.add({
      schedule: Update,
      systemGroup: MissingPhase,
      system: () => { }
    })

    throws(() => builder.pushToScheduler(scheduler), /must be registered explicitly/)
  })

  test('requires parent groups to be registered explicitly', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()

    scheduler.set(new Executable({ label: Update }))
    builder.addGroup({
      label: ParentPhase,
      parent: MissingPhase,
      schedule: Update
    })

    throws(() => builder.pushToScheduler(scheduler), /parent system group/)
  })

  test('rejects cyclic group nesting', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()

    scheduler.set(new Executable({ label: Update }))
    builder.addGroup({
      label: ParentPhase,
      parent: ChildPhase,
      schedule: Update
    })
    builder.addGroup({
      label: ChildPhase,
      parent: ParentPhase,
      schedule: Update
    })

    throws(() => builder.pushToScheduler(scheduler), /cyclic system group nesting/)
  })

  test('detects cyclic ordering constraints', () => {
    const builder = new SchedulerBuilder()
    const scheduler = new Scheduler()
    function first() { }
    function second() { }

    scheduler.set(new Executable({ label: Update }))
    builder.add({
      schedule: Update,
      after: [second],
      system: first
    })
    builder.add({
      schedule: Update,
      after: [first],
      system: second
    })

    throws(() => builder.pushToScheduler(scheduler), /cyclic system ordering/)
  })
})
