import { World } from '../../ecs/index.js'
import { ArrayInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Entity } from '../../ecs/index.js'
import { Children, Parent } from '../components/index.js'

/**
 * @param {World} world
 */
export function registerHierarchyTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const entityArrayId = typeidGeneric(Array, [Entity])
  registry.registerTypeId(entityArrayId, new ArrayInfo(typeid(Entity)))

  registry.register(Children, new StructInfo({
    list: new Field(entityArrayId)
  }))
  registry.register(Parent, new StructInfo({
    entity: new Field(typeid(Entity))
  }))
}
