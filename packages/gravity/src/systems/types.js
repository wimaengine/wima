import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Gravity2D, Gravity3D } from '../resources'

/**
 * @param {World} world
 */
export function registerGravity2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Gravity2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Gravity2D)?.setMethod(Gravity2D.serialize)
  registry.get(Gravity2D)?.setMethod(Gravity2D.deserialize)
}

/**
 * @param {World} world
 */
export function registerGravity3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Gravity3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Gravity3D)?.setMethod(Gravity3D.serialize)
  registry.get(Gravity3D)?.setMethod(Gravity3D.deserialize)
}
