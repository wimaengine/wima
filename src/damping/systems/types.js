import { World } from '../../ecs/index.js'
import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Angular2DDamping, Angular3DDamping, Linear2DDamping, Linear3DDamping } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerDamping2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Linear2DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.register(Angular2DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
}

/**
 * @param {World} world
 */
export function registerDamping3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Linear3DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.register(Angular3DDamping, new StructInfo({
    value: new Field(typeid(Number))
  }))
}
