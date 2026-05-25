/** @import { Scheduler, SystemConfig, SystemGroupConfig } from '../index.js' */
/** @import { SystemFunc } from '../../ecs/index.js' */
/** @import { Constructor, TypeId } from '../../type/index.js' */
import { Graph, kahnTopologySort } from 'vifaa'
import { assert, throws } from '../../logger/index.js'
import { typeid } from '../../type/index.js'

export class SchedulerBuilder {

  /**
   * @private
   * @type {SystemConfig[]}
   */
  systems = []

  /**
   * @private
   * @type {SystemGroupConfig[]}
   */
  systemGroups = []

  /**
   * @param {SystemConfig} config
   */
  add(config) {
    this.systems.push(config)
  }

  /**
   * @param {SystemGroupConfig} config
   */
  addGroup(config) {
    this.systemGroups.push(config)
  }

  /**
   * @param {Scheduler} scheduler
   */
  pushToScheduler(scheduler) {
    const schedules = this.createScheduleContexts()

    for (const [scheduleLabel, context] of schedules) {
      const schedule = scheduler.get(scheduleLabel)

      assert(schedule, `The schedule label "${scheduleLabel}" is not set in the provided \`Scheduler\`.`)

      for (const system of this.sortScheduleSystems(context)) {
        schedule.add(system.config.system)
      }
    }
  }

  /**
   * @private
   * @returns {Map<string, ScheduleContext>}
   */
  createScheduleContexts() {

    /** @type {Map<string, ScheduleContext>} */
    const schedules = new Map()

    for (let i = 0; i < this.systemGroups.length; i++) {
      const config = this.systemGroups[i]
      const context = getOrCreateScheduleContext(schedules, config.schedule)
      const groupTypeId = typeid(config.label)

      if (context.groupIdsByTypeId.has(groupTypeId)) {
        throws(`Duplicate system group label "${config.label.name}" on schedule "${config.schedule}".`)
      }

      /** @type {SystemGroupRegistration} */
      const group = {
        id: context.groups.length,
        config,
        systems: []
      }

      context.groups.push(group)
      context.groupIdsByTypeId.set(groupTypeId, group.id)

      const groupLabel = config.label.name

      if (groupLabel !== '') {
        const existing = context.nodesByLabel.get(groupLabel)

        if (existing) {
          throws(`Duplicate system group label "${groupLabel}" on schedule "${config.schedule}". Use a unique label or direct function references in ordering.`)
        }

        context.nodesByLabel.set(groupLabel, { kind: ScheduleNodeKind.Group, id: group.id })
      }
    }

    for (let i = 0; i < this.systems.length; i++) {
      const config = this.systems[i]
      const context = getOrCreateScheduleContext(schedules, config.schedule)
      const systemLabel = config.label || config.system.name
      const system = {
        id: context.systems.length,
        config
      }

      context.systems.push(system)
      context.systemIdsByFunc.set(systemLabel, system.id)

      // context.systemIdsByFunc.set(systemLabel, system.id) // Removed as it's no longer used

      if (systemLabel !== '') {
        const existing = context.nodesByLabel.get(systemLabel)

        if (existing) {
          throws(`Duplicate system label "${systemLabel}" on schedule "${config.schedule}". Use a unique label or direct function references in ordering.`)
        }

        context.nodesByLabel.set(systemLabel, { kind: ScheduleNodeKind.System, id: system.id })
      }
    }

    for (const [scheduleLabel, context] of schedules) {
      for (let i = 0; i < context.systems.length; i++) {
        const system = context.systems[i]
        const groupLabel = system.config.systemGroup

        if (!groupLabel) continue

        const groupId = context.groupIdsByTypeId.get(typeid(groupLabel))

        if (groupId === undefined) {
          throws(`The system group "${groupLabel.name}" must be registered explicitly before it can be used on schedule "${scheduleLabel}".`)
        }

        context.groups[groupId].systems.push(system.id)
      }
    }

    return schedules
  }

  /**
   * @private
   * @param {ScheduleContext} context
   * @returns {SystemRegistration[]}
   */
  sortScheduleSystems(context) {
    const graph = this.expandScheduleGraph(context)
    const sorted = kahnTopologySort(graph)

    if (!sorted) {
      throws(`Schedule "${context.label}" contains cyclic system ordering constraints.`)
    }

    /** @type {SystemRegistration[]} */
    const ordered = []

    for (let i = 0; i < sorted.length; i++) {
      const system = graph.getNodeWeight(sorted[i])

      assert(system, `Internal error: Could not resolve system node ${sorted[i]} on schedule "${context.label}".`)
      ordered.push(system)
    }

    return ordered
  }

  /**
   * @private
   * @param {ScheduleContext} context
   * @returns {Graph<SystemRegistration, undefined>}
   */
  expandScheduleGraph(context) {
    const graph = /** @type {Graph<SystemRegistration, undefined>} */ (new Graph(true))

    /** @type {Map<number, number>} */
    const graphIdsBySystemId = new Map()

    /** @type {Set<string>} */
    const edges = new Set()

    for (let i = 0; i < context.systems.length; i++) {
      const system = context.systems[i]
      const graphId = graph.addNode(system)

      graphIdsBySystemId.set(system.id, graphId)
    }

    for (let i = 0; i < context.systems.length; i++) {
      const system = context.systems[i]

      this.addNodeOrdering(context, graph, graphIdsBySystemId, edges, {
        kind: ScheduleNodeKind.System,
        id: system.id
      }, system.config.before, system.config.after)
    }

    for (let i = 0; i < context.groups.length; i++) {
      const group = context.groups[i]

      this.addNodeOrdering(context, graph, graphIdsBySystemId, edges, {
        kind: ScheduleNodeKind.Group,
        id: group.id
      }, group.config.before, group.config.after)
    }

    return graph
  }

  /**
   * @private
   * @param {ScheduleContext} context
   * @param {Graph<SystemRegistration, undefined>} graph
   * @param {Map<number, number>} graphIdsBySystemId
   * @param {Set<string>} edges
   * @param {ScheduleNodeRef} source
   * @param {(SystemFunc | Constructor | string)[] | undefined} before
   * @param {(SystemFunc | Constructor | string)[] | undefined} after
   */
  addNodeOrdering(context, graph, graphIdsBySystemId, edges, source, before, after) {
    if (before) {

      for (let i = 0; i < before.length; i++) {
        const label = describeReference(before[i])

        this.addExpandedEdge(context, graph, graphIdsBySystemId, edges, source, this.resolveNode(context, label), before[i])
        this.addExpandedEdge(context, graph, graphIdsBySystemId, edges, source, this.resolveNode(context, label), label)
      }
    }

    if (after) {
      for (let i = 0; i < after.length; i++) {
        const label = describeReference(after[i])

        this.addExpandedEdge(context, graph, graphIdsBySystemId, edges, this.resolveNode(context, label), source, after[i])
        this.addExpandedEdge(context, graph, graphIdsBySystemId, edges, this.resolveNode(context, label), source, label)
      }
    }
  }

  /**
   * @private
   * @param {ScheduleContext} context
   * @param {string} label
   * @returns {ScheduleNodeRef}
   */
  resolveNode(context, label) {
    const stringLabel = /** @type {string} */ (label)
    const node = context.nodesByLabel.get(stringLabel)

    if (!node) {
      throws(`Could not resolve the system or system group label "${stringLabel}" on schedule "${context.label}".`)
    }

    return node
  }

  /**
   * @private
   * @param {ScheduleContext} context
   * @param {Graph<SystemRegistration, undefined>} graph
   * @param {Map<number, number>} graphIdsBySystemId
   * @param {Set<string>} edges
   * @param {ScheduleNodeRef} from
   * @param {ScheduleNodeRef} to
   * @param {SystemFunc | Constructor | string} targetLabel
   */
  addExpandedEdge(context, graph, graphIdsBySystemId, edges, from, to, targetLabel) {
    const fromSystems = this.expandNodeToSystems(context, from)
    const toSystems = this.expandNodeToSystems(context, to)

    for (let i = 0; i < fromSystems.length; i++) {
      for (let j = 0; j < toSystems.length; j++) {
        const fromSystemId = fromSystems[i]
        const toSystemId = toSystems[j]

        if (fromSystemId === toSystemId) {
          throws(`The reference "${describeReference(targetLabel)}" creates a self-referential system ordering on schedule "${context.label}".`)
        }

        const graphFrom = graphIdsBySystemId.get(fromSystemId)
        const graphTo = graphIdsBySystemId.get(toSystemId)

        assert(graphFrom !== undefined, `Internal error: Could not resolve graph node for system ${fromSystemId} on schedule "${context.label}".`)
        assert(graphTo !== undefined, `Internal error: Could not resolve graph node for system ${toSystemId} on schedule "${context.label}".`)

        const key = `${graphFrom}:${graphTo}`

        if (edges.has(key)) continue

        edges.add(key)
        graph.addEdge(graphFrom, graphTo, undefined)
      }
    }
  }

  /**
   * @private
   * @param {ScheduleContext} context
   * @param {ScheduleNodeRef} node
   * @returns {number[]}
   */
  expandNodeToSystems(context, node) {
    if (node.kind === ScheduleNodeKind.System) return [node.id]

    return context.groups[node.id].systems
  }
}

/**
 * @param {Map<string, ScheduleContext>} schedules
 * @param {string} label
 * @returns {ScheduleContext}
 */
function getOrCreateScheduleContext(schedules, label) {
  const existing = schedules.get(label)

  if (existing) return existing

  const created = /** @type {ScheduleContext} */ ({
    label,
    systems: [],
    groups: [],
    nodesByLabel: new Map(),
    groupIdsByTypeId: new Map(),
    systemIdsByFunc: new Map()

    // systemIdsByFunc: new Map() // Removed as it's no longer used
  })

  schedules.set(label, created)

  return created
}

/**
 * @param {SystemFunc | Constructor | string} reference
 */
function describeReference(reference) {
  if (typeof reference === 'string') return reference

  return reference.name || '<anonymous>'
}

/** @enum {number} */
const ScheduleNodeKind = Object.freeze({
  System: 0,
  Group: 1
})

/**
 * @typedef ScheduleContext
 * @property {string} label
 * @property {SystemRegistration[]} systems
 * @property {SystemGroupRegistration[]} groups
 * @property {Map<string, ScheduleNodeRef>} nodesByLabel
 * @property {Map<TypeId, number>} groupIdsByTypeId
 * @property {Map<string, number>} systemIdsByFunc
 */

/**
 * @typedef SystemRegistration
 * @property {number} id
 * @property {SystemConfig} config
 */

/**
 * @typedef SystemGroupRegistration
 * @property {number} id
 * @property {SystemGroupConfig} config
 * @property {number[]} systems
 */

/**
 * @typedef ScheduleNodeRef
 * @property {ScheduleNodeKind} kind
 * @property {number} id
 */
