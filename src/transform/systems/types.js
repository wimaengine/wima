import { World, Entity } from '../../ecs/index.js'
import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Affine2, Affine3 } from '../../math/index.js'
import {
  GlobalTransform2D,
  GlobalTransform3D,
  Orientation2D,
  Orientation3D,
  Position2D,
  Position3D,
  RemoteTransform2D,
  RemoteTransform3D,
  Scale2D,
  Scale3D
} from '../components/index.js'

/**
 * @param {World} world
 */
export function registerTransform2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Position2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Position2D)?.setMethod(Position2D.copy)
  registry.get(Position2D)?.setMethod(Position2D.clone)
  registry.register(Orientation2D, new StructInfo({
    cos: new Field(typeid(Number)),
    sin: new Field(typeid(Number))
  }))
  registry.get(Orientation2D)?.setMethod(Orientation2D.copy)
  registry.get(Orientation2D)?.setMethod(Orientation2D.clone)
  registry.register(Scale2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(Scale2D)?.setMethod(Scale2D.copy)
  registry.get(Scale2D)?.setMethod(Scale2D.clone)
  registry.register(GlobalTransform2D, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.get(GlobalTransform2D)?.setMethod(GlobalTransform2D.copy)
  registry.get(GlobalTransform2D)?.setMethod(GlobalTransform2D.clone)
}

/**
 * @param {World} world
 */
export function registerTransform3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Position3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Position3D)?.setMethod(Position3D.copy)
  registry.get(Position3D)?.setMethod(Position3D.clone)
  registry.register(Orientation3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number)),
    w: new Field(typeid(Number))
  }))
  registry.get(Orientation3D)?.setMethod(Orientation3D.copy)
  registry.get(Orientation3D)?.setMethod(Orientation3D.clone)
  registry.register(Scale3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(Scale3D)?.setMethod(Scale3D.copy)
  registry.get(Scale3D)?.setMethod(Scale3D.clone)
  registry.register(GlobalTransform3D, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    e: new Field(typeid(Number)),
    f: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    h: new Field(typeid(Number)),
    i: new Field(typeid(Number)),
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.get(GlobalTransform3D)?.setMethod(GlobalTransform3D.copy)
  registry.get(GlobalTransform3D)?.setMethod(GlobalTransform3D.clone)
}

/**
 * @param {World} world
 */
export function registerRemoteTransform2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(RemoteTransform2D, new StructInfo({
    copyTranslation: new Field(typeid(Boolean)),
    copyOrientation: new Field(typeid(Boolean)),
    copyScale: new Field(typeid(Boolean)),
    entity: new Field(typeid(Entity)),
    offsetTransform: new Field(typeid(Affine2))
  }))
  registry.get(RemoteTransform2D)?.setMethod(RemoteTransform2D.copy)
  registry.get(RemoteTransform2D)?.setMethod(RemoteTransform2D.clone)
}

/**
 * @param {World} world
 */
export function registerRemoteTransform3DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(RemoteTransform3D, new StructInfo({
    copyTranslation: new Field(typeid(Boolean)),
    copyOrientation: new Field(typeid(Boolean)),
    copyScale: new Field(typeid(Boolean)),
    entity: new Field(typeid(Entity)),
    offsetTransform: new Field(typeid(Affine3))
  }))
  registry.get(RemoteTransform3D)?.setMethod(RemoteTransform3D.copy)
  registry.get(RemoteTransform3D)?.setMethod(RemoteTransform3D.clone)
}
