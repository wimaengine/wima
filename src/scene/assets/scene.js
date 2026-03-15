/** @import {EntityId} from '../../ecs/index.js' */
import { Entity, Query, World } from '../../ecs/index.js'
import { TypeRegistry } from '../../reflect/index.js'
import { SceneInstance } from '../components/index.js'

export class Scene {

  /** @type {Map<EntityId, {}[]> } */
  entities = new Map()

  /**
   * @param {World} world
   * @param {SceneInstance} instance
   * @param {TypeRegistry} _typeRegistry
   */
  toWorld(world, instance, _typeRegistry) {
    const { entityMap } = instance

    for (const [entity, components] of this.entities) {

      // TODO: Actually clone them using the typeregistry.
      const clonedComponents = components
      const worldEntity = world.spawn(clonedComponents)

      entityMap.set(worldEntity.id(), entity)
    }
  }

  /**
   * @param {World} world
   * @param {TypeRegistry} _typeRegistry
   */
  static fromWorld(world, _typeRegistry) {
    const scene = new Scene()
    const entities = new Query(world, [Entity])

    entities.each(([entity]) => {
      const cell = world.getEntity(entity)
      const components = cell
        .components()

        // TODO:  Clone the component instead using the type registry.
        .map((id) => cell.getTypeId(id))

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
