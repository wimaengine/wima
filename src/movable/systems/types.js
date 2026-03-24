import { World } from '../../ecs/index.js'
import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Acceleration2D, Acceleration3D, Rotation2D, Rotation3D, Torque2D, Torque3D, Velocity2D, Velocity3D } from '../components/index.js'

/**
 * @param {World} world
 */
export function registerMovable2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Velocity2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.register(Rotation2D, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.register(Acceleration2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.register(Torque2D, new StructInfo({
    value: new Field(typeid(Number))
  }))
}

/**
 * @param {World} world
 */
export function registerMovable3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Velocity3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.register(Rotation3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.register(Acceleration3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.register(Torque3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
}
