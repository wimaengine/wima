/** @import { World } from '@wimaengine/ecs' */
import { EntityHandle } from '@wimaengine/ecs'
import { Command } from '@wimaengine/command'
import { assert, warn } from '@wimaengine/logger'
import { Children, Parent } from '@wimaengine/hierarchy'
import { TypeRegistry } from '@wimaengine/reflect'
import { RelationshipQuery } from '@wimaengine/relationship'
import { typeid } from '@wimaengine/type'
import { SpawnCommand } from './spawn'

const entityTypeId = typeid(EntityHandle)
const parentTypeId = typeid(Parent)
const childrenTypeId = typeid(Children)

/**
 * @param {World} world
 * @param {EntityHandle} entity
 * @param {EntityHandle[]} ordered
 */
function collectHierarchy(world, entity, ordered) {
  ordered.push(entity)

  const query = new RelationshipQuery(world, Children, Parent)

  query.treedfs(entity, ([descendant]) => {
    ordered.push(/** @type {EntityHandle} */ (descendant))
  })
}

export class CloneCommand extends Command {

  /**
   * @readonly
   * @type {SpawnCommand[]}
   */
  commands

  /**
   * @readonly
   * @type {EntityHandle}
   */
  entity

  /**
   * @param {SpawnCommand[]} commands
   */
  constructor(commands) {
    super()
    assert(commands.length > 0, 'A clone command must contain at least one entity.')
    this.commands = commands
    this.entity = commands[0].entity
  }

  /**
   * @param {World} world
   * @param {EntityHandle} entity
   * @returns {CloneCommand}
   */
  static create(world, entity) {
    const cell = world.getEntity(entity)

    assert(cell.exists(), `The entity ${entity.id()} cannot be cloned because it does not exist.`)

    const registry = world.getResource(TypeRegistry)
    /** @type {EntityHandle[]} */
    const ordered = []
    /** @type {SpawnCommand[]} */
    const cloneCommands = []
    /** @type {Map<number, number>} */
    const entityMap = new Map()

    collectHierarchy(world, entity, ordered)

    try {
      for (let i = 0; i < ordered.length; i++) {
        const cloneEntity = world.spawn([])

        cloneCommands.push(new SpawnCommand(cloneEntity))
        entityMap.set(ordered[i].id(), cloneEntity.id())
      }

      for (let i = 0; i < ordered.length; i++) {
        const source = ordered[i]
        const sourceCell = world.getEntity(source)
        /** @type {object[]} */
        const clonedComponents = []
        const typeIds = sourceCell.components()

        for (let j = 0; j < typeIds.length; j++) {
          const typeId = typeIds[j]

          if (typeId === entityTypeId || typeId === childrenTypeId) {
            continue
          }

          const entry = registry.getByTypeId(typeId)

          if (!entry) {
            warn(`The type \`${typeId}\` is not registered in the type registry`)
            continue
          }

          const component = /** @type {object | undefined} */ (sourceCell.getTypeId(typeId))

          if (!component) {
            continue
          }

          const clonedComponent = /** @type {object | undefined} */ (entry.call('clone', [component]))

          if (!clonedComponent) {
            warn(
              `The type \`${typeId}\` has not been cloned as there is no \`clone\` method registered in the \`TypeRegistry\``
            )
            continue
          }

          if (typeId !== parentTypeId || !source.equals(entity)) {
            entry.getMethod('map')?.method?.call(clonedComponent, entityMap)
          }

          clonedComponents.push(clonedComponent)
        }

        cloneCommands[i].insertPrefab(clonedComponents)
      }
    } catch (error) {
      for (let i = 0; i < cloneCommands.length; i++) {
        world.despawn(cloneCommands[i].entity)
      }

      throw error
    }

    return new CloneCommand(cloneCommands)
  }

  /**
   * @param {World} world
   */
  execute(world) {
    for (let i = 0; i < this.commands.length; i++) {
      this.commands[i].execute(world)
    }
  }
}
