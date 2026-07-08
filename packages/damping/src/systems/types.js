import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Angular2DDamping, Angular3DDamping, Linear2DDamping, Linear3DDamping } from '../resources'

/**
 * @param {World} world
 */
export function registerDamping2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Linear2DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Linear2DDamping)?.setMethod(Linear2DDamping.serialize)
  registry.get(Linear2DDamping)?.setMethod(Linear2DDamping.deserialize)
  registry.register(Angular2DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Angular2DDamping)?.setMethod(Angular2DDamping.serialize)
  registry.get(Angular2DDamping)?.setMethod(Angular2DDamping.deserialize)
}

/**
 * @param {World} world
 */
export function registerDamping3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Linear3DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Linear3DDamping)?.setMethod(Linear3DDamping.serialize)
  registry.get(Linear3DDamping)?.setMethod(Linear3DDamping.deserialize)
  registry.register(Angular3DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Angular3DDamping)?.setMethod(Angular3DDamping.serialize)
  registry.get(Angular3DDamping)?.setMethod(Angular3DDamping.deserialize)
}
