/** @import { SystemConfig, SystemGroupConfig } from './systemconfig' */
/** @import { Scheduler } from './scheduler' */
/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { Constructor, TypeId } from '@wimaengine/type' */
import { assert, throws } from '@wimaengine/logger'
import { typeid } from '@wimaengine/type'
import { Graph, kahnTopologySort } from 'vifaa'
import { Executable } from './executable'

export class ScheduleContext {

  /**
   * @param {Constructor} label
   */
  constructor(label) {
    this.label = label
  }

  /**
   * @type {Constructor}
   */
  label

  /**
   * @type {SystemRegistration[]}
   */
  systems = []

  /**
   * @type {SystemGroupRegistration[]}
   */
  groups = []

  /**
   * @type {Map<string, ScheduleNodeRef>}
   */
  nodesByLabel = new Map()

  /**
   * @type {Map<TypeId, number>}
   */
  groupIdsByTypeId = new Map()

  /**
   * @type {Map<number, number> | undefined}
   */
  graphIdsByGroupId = undefined

  /**
   * @type {Constructor | undefined}
   */
  defaultSystemGroup = undefined

  /**
   * @param {SystemGroupConfig} config
   */
  addGroup(config) {
    const groupTypeId = typeid(config.label)

    if (this.groupIdsByTypeId.has(groupTypeId)) {
      throws(`Duplicate system group label "${config.label.name}" on schedule "${config.schedule.name}".`)
    }

    /** @type {SystemGroupRegistration} */
    const group = {
      id: this.groups.length,
      config,
      parentId: undefined,
      systems: []
    }

    this.groups.push(group)
    this.groupIdsByTypeId.set(groupTypeId, group.id)

    const groupLabel = config.label.name

    if (groupLabel !== '') {
      const existing = this.nodesByLabel.get(groupLabel)

      if (existing) {
        throws(`Duplicate system group label "${groupLabel}" on schedule "${config.schedule.name}". Use a unique label or direct function references in ordering.`)
      }

      this.nodesByLabel.set(groupLabel, { kind: ScheduleNodeKind.Group, id: group.id })
    }

    return group
  }

  /**
   * @param {SystemConfig} config
   */
  addSystem(config) {
    const systemLabel = config.label || config.system.name

    const system = {
      id: this.systems.length,
      config
    }

    this.systems.push(system)

    if (systemLabel !== '') {
      const existing = this.nodesByLabel.get(systemLabel)

      if (existing) {
        throws(`Duplicate system label "${systemLabel}" on schedule "${config.schedule.name}". Use a unique label or direct function references in ordering.`)
      }

      this.nodesByLabel.set(systemLabel, { kind: ScheduleNodeKind.System, id: system.id })
    }

    return system
  }

  /**
   * @param {Constructor | undefined} defaultSystemGroup
   */
  setDefaultSystemGroup(defaultSystemGroup) {
    this.defaultSystemGroup = defaultSystemGroup
  }

  /**
   * Resolves group parents and validates that the hierarchy is acyclic.
   */
  resolveGroupParents() {
    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i]
      const parentLabel = group.config.parent

      if (!parentLabel) continue

      const parentId = this.groupIdsByTypeId.get(typeid(parentLabel))

      if (parentId === undefined) {
        throws(`The parent system group "${parentLabel.name}" must be registered explicitly before it can be used on schedule "${this.label.name}".`)
      }

      group.parentId = parentId
    }

    this.assertNoGroupCycles()
  }

  /**
   * Assigns systems to their configured groups.
   */
  assignSystemsToGroups() {
    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]
      const groupLabel = system.config.systemGroup ?? this.defaultSystemGroup

      if (!groupLabel) continue

      const groupId = this.groupIdsByTypeId.get(typeid(groupLabel))

      if (groupId === undefined) {
        throws(`The system group "${groupLabel.name}" must be registered explicitly before it can be used on schedule "${this.label.name}".`)
      }

      this.groups[groupId].systems.push(system.id)
    }
  }

  /**
   * @returns {SystemRegistration[]}
   */
  sortSystems() {
    const { graph, systemsByGraphId } = this.expandScheduleGraph()
    const sorted = kahnTopologySort(graph)

    if (!sorted) {
      throws(`Schedule "${this.label.name}" contains cyclic system ordering constraints.`)
    }

    /** @type {SystemRegistration[]} */
    const ordered = []

    for (let i = 0; i < sorted.length; i++) {
      const system = systemsByGraphId.get(sorted[i])

      if (!system) continue

      ordered.push(system)
    }

    return ordered
  }

  /**
   * @returns {{ graph: Graph<SystemRegistration | SystemGroupRegistration, undefined>, systemsByGraphId: Map<number, SystemRegistration> }}
   */
  expandScheduleGraph() {
    const graph = /** @type {Graph<SystemRegistration | SystemGroupRegistration, undefined>} */ (new Graph(true))

    /** @type {Map<number, number>} */
    const graphIdsBySystemId = new Map()

    /** @type {Map<number, number>} */
    const graphIdsByGroupId = new Map()

    this.graphIdsByGroupId = graphIdsByGroupId

    /** @type {Map<number, SystemRegistration>} */
    const systemsByGraphId = new Map()

    /** @type {Map<number, number[]>} */
    const groupSystemsCache = new Map()

    /** @type {Set<string>} */
    const edges = new Set()

    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i]
      const graphId = graph.addNode(group)

      graphIdsByGroupId.set(group.id, graphId)
    }

    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]
      const graphId = graph.addNode(system)

      graphIdsBySystemId.set(system.id, graphId)
      systemsByGraphId.set(graphId, system)
    }

    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]

      this.addNodeOrdering(graph, graphIdsBySystemId, edges, {
        kind: ScheduleNodeKind.System,
        id: system.id
      }, system.config.before, system.config.after, groupSystemsCache)
    }

    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i]

      this.addNodeOrdering(graph, graphIdsBySystemId, edges, {
        kind: ScheduleNodeKind.Group,
        id: group.id
      }, group.config.before, group.config.after, groupSystemsCache)
    }

    return {
      graph,
      systemsByGraphId
    }
  }

  /**
   * @param {Graph<SystemRegistration | SystemGroupRegistration, undefined>} graph
   * @param {Map<number, number>} graphIdsBySystemId
   * @param {Set<string>} edges
   * @param {ScheduleNodeRef} source
   * @param {(SystemFunc | Constructor | string)[] | undefined} before
   * @param {(SystemFunc | Constructor | string)[] | undefined} after
   * @param {Map<number, number[]>} groupSystemsCache
   */
  addNodeOrdering(graph, graphIdsBySystemId, edges, source, before, after, groupSystemsCache) {
    if (before) {

      for (let i = 0; i < before.length; i++) {
        const label = describeReference(before[i])

        this.addExpandedEdge(graph, graphIdsBySystemId, edges, source, this.resolveNode(label), before[i], groupSystemsCache)
        this.addExpandedEdge(graph, graphIdsBySystemId, edges, source, this.resolveNode(label), label, groupSystemsCache)
      }
    }

    if (after) {
      for (let i = 0; i < after.length; i++) {
        const label = describeReference(after[i])

        this.addExpandedEdge(graph, graphIdsBySystemId, edges, this.resolveNode(label), source, after[i], groupSystemsCache)
        this.addExpandedEdge(graph, graphIdsBySystemId, edges, this.resolveNode(label), source, label, groupSystemsCache)
      }
    }
  }

  /**
   * @param {string} label
   * @returns {ScheduleNodeRef}
   */
  resolveNode(label) {
    const stringLabel = /** @type {string} */ (label)
    const node = this.nodesByLabel.get(stringLabel)

    if (!node) {
      throws(`Could not resolve the system or system group label "${stringLabel}" on schedule "${this.label.name}".`)
    }

    return node
  }

  /**
   * @param {Graph<SystemRegistration | SystemGroupRegistration, undefined>} graph
   * @param {Map<number, number>} graphIdsBySystemId
   * @param {Set<string>} edges
   * @param {ScheduleNodeRef} from
   * @param {ScheduleNodeRef} to
   * @param {SystemFunc | Constructor | string} targetLabel
   * @param {Map<number, number[]>} groupSystemsCache
   */
  addExpandedEdge(graph, graphIdsBySystemId, edges, from, to, targetLabel, groupSystemsCache) {
    const fromNodes = this.expandNodeToOrderingNodes(from, graphIdsBySystemId, groupSystemsCache)
    const toNodes = this.expandNodeToOrderingNodes(to, graphIdsBySystemId, groupSystemsCache)

    for (let i = 0; i < fromNodes.length; i++) {
      for (let j = 0; j < toNodes.length; j++) {
        const fromNodeId = fromNodes[i]
        const toNodeId = toNodes[j]

        if (fromNodeId === toNodeId) {
          throws(`The reference "${describeReference(targetLabel)}" creates a self-referential system ordering on schedule "${this.label.name}".`)
        }

        const key = `${fromNodeId}:${toNodeId}`

        if (edges.has(key)) continue

        edges.add(key)
        graph.addEdge(fromNodeId, toNodeId, undefined)
      }
    }
  }

  /**
   * @param {ScheduleNodeRef} node
   * @param {Map<number, number>} graphIdsBySystemId
   * @param {Map<number, number[]>} groupSystemsCache
   * @returns {number[]}
   */
  expandNodeToOrderingNodes(node, graphIdsBySystemId, groupSystemsCache) {
    if (node.kind === ScheduleNodeKind.System) {
      const graphId = graphIdsBySystemId.get(node.id)

      assert(graphId !== undefined, `Internal error: Could not resolve graph node for system ${node.id} on schedule "${this.label.name}".`)

      return [graphId]
    }

    const systems = this.expandGroupToSystems(node.id, groupSystemsCache, new Set())

    if (systems.length > 0) {

      /** @type {number[]} */
      const graphIds = []

      for (let i = 0; i < systems.length; i++) {
        const graphId = graphIdsBySystemId.get(systems[i])

        assert(graphId !== undefined, `Internal error: Could not resolve graph node for system ${systems[i]} on schedule "${this.label.name}".`)
        graphIds.push(graphId)
      }

      return graphIds
    }

    const graphId = this.expandGroupToGraphNode(node.id)

    return [graphId]
  }

  /**
   * @param {number} groupId
   * @returns {number}
   */
  expandGroupToGraphNode(groupId) {
    const graphId = this.graphIdsByGroupId?.get(groupId)

    assert(graphId !== undefined, `Internal error: Could not resolve graph node for system group ${groupId} on schedule "${this.label.name}".`)

    return graphId
  }

  /**
   * @param {ScheduleNodeRef} node
   * @param {Map<number, number[]>} groupSystemsCache
   * @returns {number[]}
   */
  expandNodeToSystems(node, groupSystemsCache) {
    if (node.kind === ScheduleNodeKind.System) return [node.id]

    return this.expandGroupToSystems(node.id, groupSystemsCache, new Set())
  }

  /**
   * @param {number} groupId
   * @param {Map<number, number[]>} cache
   * @param {Set<number>} visiting
   * @returns {number[]}
   */
  expandGroupToSystems(groupId, cache, visiting) {
    const cached = cache.get(groupId)

    if (cached) return cached

    if (visiting.has(groupId)) {
      const group = this.groups[groupId]

      throws(`Schedule "${this.label.name}" contains cyclic system group nesting involving "${group.config.label.name}".`)
    }

    visiting.add(groupId)

    /** @type {number[]} */
    const systems = [...this.groups[groupId].systems]

    for (let i = 0; i < this.groups.length; i++) {
      const child = this.groups[i]

      if (child.parentId !== groupId) continue

      const childSystems = this.expandGroupToSystems(child.id, cache, visiting)

      for (let j = 0; j < childSystems.length; j++) {
        systems.push(childSystems[j])
      }
    }

    visiting.delete(groupId)
    cache.set(groupId, systems)

    return systems
  }

  /**
   * Validates that group nesting is acyclic.
   */
  assertNoGroupCycles() {

    /** @type {GroupVisitState[]} */
    const state = new Array(this.groups.length).fill(GroupVisitState.Unvisited)

    for (let i = 0; i < this.groups.length; i++) {
      this.visitGroupHierarchy(i, state)
    }
  }

  /**
   * @param {number} groupId
   * @param {GroupVisitState[]} state
   */
  visitGroupHierarchy(groupId, state) {
    const visitState = state[groupId]

    if (visitState === GroupVisitState.Visiting) {
      const group = this.groups[groupId]

      throws(`Schedule "${this.label.name}" contains cyclic system group nesting involving "${group.config.label.name}".`)
    }

    if (visitState === GroupVisitState.Visited) return

    state[groupId] = GroupVisitState.Visiting

    const { parentId } = this.groups[groupId]

    if (parentId !== undefined) {
      this.visitGroupHierarchy(parentId, state)
    }

    state[groupId] = GroupVisitState.Visited
  }
}

export class SchedulerBuilder {

  /**
   * @private
   * @type {Map<string, ScheduleContext>}
   */
  schedules = new Map()

  /**
   * @private
   * @type {{label: Constructor, delay?: number, repeat?: boolean, errorHandler?: (error: Error, world: import('@wimaengine/ecs').World) => void, defaultSystemGroup?: Constructor}[]}
   */
  scheduleConfigs = []

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
   * Clears the collected build state.
   */
  clear() {
    this.scheduleConfigs = []
    this.systems = []
    this.systemGroups = []
    this.schedules = new Map()

    return this
  }

  /**
   * @param {{label: Constructor, delay?: number, repeat?: boolean, errorHandler?: (error: Error, world: import('@wimaengine/ecs').World) => void, defaultSystemGroup?: Constructor}} config
   */
  addSchedule(config) {
    this.scheduleConfigs.push(config)
  }

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
    for (let i = 0; i < this.scheduleConfigs.length; i++) {
      scheduler.set(new Executable(this.scheduleConfigs[i]))
    }

    /** @type {Map<string,  Constructor>} */
    const defaultGroupsBySchedule = new Map()

    for (let i = 0; i < this.scheduleConfigs.length; i++) {
      const config = this.scheduleConfigs[i]

      defaultGroupsBySchedule.set(typeid(config.label), config.defaultSystemGroup)
    }

    const schedules = this.createScheduleContexts(defaultGroupsBySchedule)

    for (const [, context] of schedules) {
      const schedule = scheduler.get(context.label)

      assert(schedule, `The schedule label "${context.label.name}" is not set in the provided \`Scheduler\`.`)

      for (const system of context.sortSystems()) {
        schedule.add(system.config.system)
      }
    }
  }

  /**
   * @private
   * @param {Map<string, Constructor | undefined>} defaultGroupsBySchedule
   * @returns {Map<string, ScheduleContext>}
   */
  createScheduleContexts(defaultGroupsBySchedule) {
    for (let i = 0; i < this.systemGroups.length; i++) {
      const config = this.systemGroups[i]
      const context = getOrCreateScheduleContext(this.schedules, config.schedule)

      context.addGroup(config)
    }

    for (let i = 0; i < this.systems.length; i++) {
      const config = this.systems[i]
      const context = getOrCreateScheduleContext(this.schedules, config.schedule)

      context.addSystem(config)
    }

    for (const [, context] of this.schedules) {
      context.setDefaultSystemGroup(defaultGroupsBySchedule.get(typeid(context.label)))
      context.resolveGroupParents()
      context.assignSystemsToGroups()
    }

    return this.schedules
  }

  static Instance = new SchedulerBuilder()
}

/**
 * @param {Map<string, ScheduleContext>} schedules
 * @param {Constructor} label
 * @returns {ScheduleContext}
 */
function getOrCreateScheduleContext(schedules, label) {
  const scheduleTypeId = typeid(label)
  const existing = schedules.get(scheduleTypeId)

  if (existing) return existing

  const created = new ScheduleContext(label)

  schedules.set(scheduleTypeId, created)

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
 * @typedef SystemRegistration
 * @property {number} id
 * @property {SystemConfig} config
 */

/**
 * @typedef SystemGroupRegistration
 * @property {number} id
 * @property {SystemGroupConfig} config
 * @property {number | undefined} parentId
 * @property {number[]} systems
 */

/**
 * @typedef ScheduleNodeRef
 * @property {ScheduleNodeKind} kind
 * @property {number} id
 */

/**
 * @enum {number}
 */
const GroupVisitState = Object.freeze({
  Unvisited: 0,
  Visiting: 1,
  Visited: 2
})
