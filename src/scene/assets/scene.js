/** @import {EntityId} from '../../ecs/index.js' */
import { Entity, Query, World } from '../../ecs/index.js'
import { Parent } from '../../hierarchy/index.js'
import { warn } from '../../logger/index.js'
import { TypeRegistry } from '../../reflect/index.js'
import { SceneInstance } from '../components/index.js'

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
    const { entityMap } = instance

    for (const [entity, components] of this.entities) {

      const clonedComponents = components.map((component)=>{
        const constructor = /**@type {import('../../type/index.js').Constructor}*/(component.constructor)
        const clone = typeRegistry
        .get(constructor)
        ?.call("clone",[component])

        if(clone){
          return clone
        } else {
          warn(`The component \`${constructor.name}\` has not been cloned as there is no clone method registered in the \`TypeRegistry\``)
          return undefined
        }
      }).filter((e)=>e !== undefined)

      if (!clonedComponents.some((c)=>c.constructor === Parent)) {
        clonedComponents.push(new Parent(instanceEntity))
      }
      const worldEntity = world.spawn(clonedComponents)

      entityMap.set(worldEntity.id(), entity)
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
        const clone = /**@type {object} */(typeRegistry
          .getByTypeId(typeId)
          ?.call("clone", [component]))

        if (clone) {
          components.push(clone)
        } else {
          const constructor = component.constructor
          const name = constructor.name || "Unknown"
          warn(`The component \`${name}\` has not been cloned as there is no clone method registered in the \`TypeRegistry\``)
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
