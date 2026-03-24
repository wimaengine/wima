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
  registry.register(Orientation2D, new StructInfo({
    cos: new Field(typeid(Number)),
    sin: new Field(typeid(Number))
  }))
  registry.register(Scale2D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.register(GlobalTransform2D, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
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
  registry.register(Orientation3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number)),
    w: new Field(typeid(Number))
  }))
  registry.register(Scale3D, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
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
}
