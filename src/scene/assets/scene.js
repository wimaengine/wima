/** @import {EntityId} from '../../ecs/index.js' */
import { Entity, Query, World } from '../../ecs/index.js'
import { Parent } from '../../hierarchy/index.js'
import { warn } from '../../logger/index.js'
import { TypeRegistry } from '../../reflect/index.js'
import { SceneInstance } from '../components/index.js'

/**
 * @param {unknown} component
 * @param {World} world
 * @param {import('../../reflect/resources/typeregistry.js').TypeEntry | undefined} entry
 */
function toSnapshot(component, world, entry) {
  const method = entry?.getMethod('toSnapshot')

  if (method) {
    return method.method.call(component, world)
  }

  const clone = entry?.getMethod('clone')

  if (clone) {
    return clone.method.call(component)
  }

  const { constructor } = component
  const name = constructor.name || 'Unknown'

  warn(`The component \`${name}\` has not been snapshotted as there is no toSnapshot or clone method registered in the \`TypeRegistry\``)

  return undefined
}

/**
 * @param {unknown} component
 * @param {World} world
 * @param {import('../../reflect/resources/typeregistry.js').TypeEntry | undefined} entry
 */
function fromSnapshot(component, world, entry) {
  const method = entry?.getMethod('fromSnapshot')

  if (method) {
    return method.method.call(component, world)
  }

  const clone = entry?.call('clone', [component])

  if (clone) {
    return clone
  }

  const { constructor } = component
  const name = constructor.name || 'Unknown'

  warn(`The component \`${name}\` has not been restored as there is no fromSnapshot or clone method registered in the \`TypeRegistry\``)

  return undefined
}

export class Scene {

  /** @type {Map<EntityId, object[]> } */
  entities = new Map()

  /**
   * @param {World} world
   * @param {SceneInstance} instance
   * @param {TypeRegistry} typeRegistry
   * @param {Entity} [instanceEntity]
   */
  toWorld(world, instance, typeRegistry, instanceEntity) {
    const { entityMap: worldToSceneMap } = instance
    const sceneToWorldMap = new Map()

    for (const entity of this.entities.keys()) {
      const worldEntity = world.spawn([])

      worldToSceneMap.set(worldEntity.id(), entity)
      sceneToWorldMap.set(entity, worldEntity.id())
    }

    for (const [entity, components] of this.entities) {
      const worldEntity = sceneToWorldMap.get(entity)
      const clonedComponents = components.map((component) => {
        const { constructor } = component
        const type = /** @type {import('../../type/index.js').Constructor} */ (constructor)
        const entry = typeRegistry.get(type)
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
        const typeId = typeIds[i]
        const component = cell.getTypeId(typeId)
        const entry = typeRegistry.getByTypeId(typeId)
        const snapshot = toSnapshot(component, world, entry)

        if (snapshot) {
          components.push(/** @type {object} */(snapshot))
        }
      }

      scene.entities.set(entity.id(), components)
    })

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
