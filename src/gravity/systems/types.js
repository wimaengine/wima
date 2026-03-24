import { World } from '../../ecs/index.js'
import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Gravity2D, Gravity3D } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerGravity2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Gravity2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
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
}
