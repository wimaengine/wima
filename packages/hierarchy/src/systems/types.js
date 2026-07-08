import { EntityHandle, World } from '@wimaengine/ecs'
import { ArrayInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Children, Parent } from '../components'

/**
 * @param {World} world
 */
export function registerHierarchyTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const entityArrayId = typeidGeneric(Array, [EntityHandle])

  registry.registerTypeId(entityArrayId, new ArrayInfo(typeid(EntityHandle)))

  registry.register(Children, new StructInfo({
    list: new Field(entityArrayId)
  }))
  registry.get(Children)?.setMethod(Children.copy)
  registry.get(Children)?.setMethod(Children.clone)
  registry.get(Children)?.setMethod(Children.serialize)
  registry.get(Children)?.setMethod(Children.deserialize)
  registry.get(Children)?.setMethod(Children.prototype.visit)
  registry.get(Children)?.setMethod(Children.prototype.map)
  registry.register(Parent, new StructInfo({
    entity: new Field(typeid(EntityHandle))
  }))
  registry.get(Parent)?.setMethod(Parent.copy)
  registry.get(Parent)?.setMethod(Parent.clone)
  registry.get(Parent)?.setMethod(Parent.serialize)
  registry.get(Parent)?.setMethod(Parent.deserialize)
  registry.get(Parent)?.setMethod(Parent.prototype.visit)
  registry.get(Parent)?.setMethod(Parent.prototype.map)
}
