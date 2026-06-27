/** @import {EntityId} from '../../ecs/index.js' */
import { Entity, Query, World } from '../../ecs/index.js'
import { Parent } from '../../hierarchy/index.js'
import { warn } from '../../logger/index.js'
import { TypeRegistry } from '../../reflect/index.js'
import { typeid } from '../../type/index.js'
import { SceneInstance } from '../components/index.js'

export class Scene {

  /** @type {Map<EntityId, object[]> } */
  entities = new Map()

  /**
   * Resource snapshots keyed by their snapshot type id.
   * @type {Map<import('../../type/index.js').TypeId, object>}
   */
  resources = new Map()

  /**
   * @param {World} world
   * @param {SceneInstance} instance
   * @param {TypeRegistry} typeRegistry
   * @param {Entity} instanceEntity
   */
  toWorld(world, instance, typeRegistry, instanceEntity) {
    const { entityMap: worldToSceneMap } = instance
    const sceneToWorldMap = new Map()

    for (const entity of this.entities.keys()) {
      const worldEntity = world.spawn([])

      worldToSceneMap.set(worldEntity.id(), entity)
      sceneToWorldMap.set(entity, worldEntity.id())
    }

    for (const [typeId, resource] of this.resources) {
      const entry = typeRegistry.getByTypeId(typeId)

      if (!entry) {
        warn(`The type \`${typeId}\` is not registered in the type registry`)
        continue
      }

      const restoredResource = fromSnapshot(resource, world, entry)

      if (!restoredResource) {
        continue
      }

      entry
        .getMethod('map')
        ?.method
        ?.call(restoredResource, sceneToWorldMap)

      world.setResource(restoredResource)
    }

    for (const [entity, components] of this.entities) {
      const worldEntity = sceneToWorldMap.get(entity)
      const clonedComponents = components.map((component) => {
        const { constructor } = component

        if (constructor === Entity) {
          return undefined
        }

        const componentType = /** @type {import('../../type/index.js').Constructor} */ (constructor)
        const entry = typeRegistry.get(componentType)

        if (!entry) {
          warn(`The type \`${componentType.name}\` is not registered in the type registry`)

          return undefined
        }

        const clonedComponent = fromSnapshot(component, world, entry)

        if (!clonedComponent) {
          return undefined
        }

        entry
          .getMethod('map')
          ?.method
          ?.call(clonedComponent, sceneToWorldMap)

        return clonedComponent
      }).filter((e) => e !== undefined)

      if (!clonedComponents.some((c) => c.constructor === Parent)) {
        clonedComponents.push(new Parent(instanceEntity))
      }

      world.insert(Entity.from(worldEntity), clonedComponents)
    }
  }

  /**
   * @param {World} world
   * @param {TypeRegistry} typeRegistry
   */
  static fromWorld(world, typeRegistry) {
    const scene = new Scene()
    const entities = new Query(world, [Entity])

    entities.each(([entity]) => {
      const cell = world.getEntity(entity)
      const typeIds = cell.components()
      const components = []

      for (let i = 0; i < typeIds.length; i++) {
        const typeId = /** @type {import('../../type/index.js').TypeId} */(typeIds[i])
        const component = /** @type {object} */(cell.getTypeId(typeId))
        const entry = typeRegistry.getByTypeId(typeId)

        if (!entry) {
          const name = component?.constructor?.name || 'Unknown'

          warn(`The type \`${name}\` is not registered in the type registry`)
          continue
        }

        const snapshot = toSnapshot(component, world, entry)

        if (snapshot) {
          components.push(/** @type {object} */(snapshot))
        }
      }

      scene.entities.set(entity.id(), components)
    })

    for (const [typeId, resource] of world.getResources()) {
      const resourceObject = /** @type {object} */ (resource)
      const entry = typeRegistry.getByTypeId(typeId)

      if (!entry) {
        warn(`The type \`${typeId}\` is not registered in the type registry`)
        continue
      }

      const snapshot = toSnapshot(resourceObject, world, entry)

      if (!snapshot) {
        continue
      }

      scene.resources.set(
        typeid(/** @type {import('../../type/index.js').Constructor} */ (snapshot.constructor)),
        /** @type {object} */ (snapshot)
      )
    }

    return scene
  }

  entityCount() {
    return this.entities.size
  }

  /**
   * @param {Entity} entity
   * @param {{}[]} components
   */
  set(entity, components) {
    this.entities.set(entity.id(), components)
  }

  * [Symbol.iterator]() {
    return this.entities
  }
}

/**
 * @param {object} component
 * @param {World} world
 * @param {import('../../reflect/resources/typeregistry.js').TypeEntry} entry
 */
function toSnapshot(component, world, entry) {
  const method = entry.getMethod('toSnapshot')

  if (method) {
    return method.method.call(component, world)
  }

  const clone = entry.call('clone', [component])

  if (clone) {
    return clone
  }

  const name = component?.constructor?.name || 'Unknown'

  warn(`The component \`${name}\` has not been snapshotted as there is no \`toSnapshot\` or \`clone\` method registered in the \`TypeRegistry\``)

  return undefined
}

/**
 * @param {object} component
 * @param {World} world
 * @param {import('../../reflect/resources/typeregistry.js').TypeEntry} entry
 */
function fromSnapshot(component, world, entry) {
  const method = entry.getMethod('fromSnapshot')

  if (method) {
    return method.method.call(component, world)
  }

  const clone = entry.call('clone', [component])

  if (clone) {
    return clone
  }

  const name = component?.constructor?.name || 'Unknown'

  warn(`The component \`${name}\` has not been restored as there is no \`fromSnapshot\` or \`clone\` method registered in the \`TypeRegistry\``)

  return undefined
}
