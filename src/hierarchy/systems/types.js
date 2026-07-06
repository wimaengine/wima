import { EntityHandle, World } from '../../ecs/index.js'
import { ArrayInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Children, Parent } from '../components/index.js'

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
