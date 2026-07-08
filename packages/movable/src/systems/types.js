import { World } from '@wimaengine/ecs'
import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Acceleration2D, Acceleration3D, Rotation2D, Rotation3D, Torque2D, Torque3D, Velocity2D, Velocity3D } from '../components'

/**
 * @param {World} world
 */
export function registerMovable2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Velocity2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Velocity2D)?.setMethod(Velocity2D.copy)
  registry.get(Velocity2D)?.setMethod(Velocity2D.clone)
  registry.get(Velocity2D)?.setMethod(Velocity2D.serialize)
  registry.get(Velocity2D)?.setMethod(Velocity2D.deserialize)
  registry.register(Rotation2D, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Rotation2D)?.setMethod(Rotation2D.copy)
  registry.get(Rotation2D)?.setMethod(Rotation2D.clone)
  registry.get(Rotation2D)?.setMethod(Rotation2D.serialize)
  registry.get(Rotation2D)?.setMethod(Rotation2D.deserialize)
  registry.register(Acceleration2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Acceleration2D)?.setMethod(Acceleration2D.copy)
  registry.get(Acceleration2D)?.setMethod(Acceleration2D.clone)
  registry.get(Acceleration2D)?.setMethod(Acceleration2D.serialize)
  registry.get(Acceleration2D)?.setMethod(Acceleration2D.deserialize)
  registry.register(Torque2D, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.get(Torque2D)?.setMethod(Torque2D.copy)
  registry.get(Torque2D)?.setMethod(Torque2D.clone)
  registry.get(Torque2D)?.setMethod(Torque2D.serialize)
  registry.get(Torque2D)?.setMethod(Torque2D.deserialize)
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
  registry.get(Velocity3D)?.setMethod(Velocity3D.copy)
  registry.get(Velocity3D)?.setMethod(Velocity3D.clone)
  registry.get(Velocity3D)?.setMethod(Velocity3D.serialize)
  registry.get(Velocity3D)?.setMethod(Velocity3D.deserialize)
  registry.register(Rotation3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Rotation3D)?.setMethod(Rotation3D.copy)
  registry.get(Rotation3D)?.setMethod(Rotation3D.clone)
  registry.get(Rotation3D)?.setMethod(Rotation3D.serialize)
  registry.get(Rotation3D)?.setMethod(Rotation3D.deserialize)
  registry.register(Acceleration3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Acceleration3D)?.setMethod(Acceleration3D.copy)
  registry.get(Acceleration3D)?.setMethod(Acceleration3D.clone)
  registry.get(Acceleration3D)?.setMethod(Acceleration3D.serialize)
  registry.get(Acceleration3D)?.setMethod(Acceleration3D.deserialize)
  registry.register(Torque3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Torque3D)?.setMethod(Torque3D.copy)
  registry.get(Torque3D)?.setMethod(Torque3D.clone)
  registry.get(Torque3D)?.setMethod(Torque3D.serialize)
  registry.get(Torque3D)?.setMethod(Torque3D.deserialize)
}
