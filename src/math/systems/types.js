import { World } from '../../ecs/index.js'
import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import {
  Affine2,
  Affine3,
  Angle,
  Basis2,
  Basis3,
  BVector2,
  BVector3,
  BVector4,
  Matrix2,
  Matrix3,
  Matrix4,
  Quaternion,
  Rotary,
  Vector2,
  Vector3,
  Vector4
} from '../core/index.js'

/**
 * @param {World} world
 */
export function registerMathTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Angle, new StructInfo({
    value: new Field(typeid(Number))
  }))
  registry.register(Rotary, new StructInfo({
    cos: new Field(typeid(Number)),
    sin: new Field(typeid(Number))
  }))
  registry.register(Quaternion, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number)),
    w: new Field(typeid(Number))
  }))
  registry.register(Affine2, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.register(Affine3, new StructInfo({
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
  registry.register(Basis2, new StructInfo({
    x: new Field(typeid(Vector2)),
    y: new Field(typeid(Vector2))
  }))
  registry.register(Basis3, new StructInfo({
    x: new Field(typeid(Vector3)),
    y: new Field(typeid(Vector3)),
    z: new Field(typeid(Vector3))
  }))
  registry.register(Vector2, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number))
  }))
  registry.register(Vector3, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number))
  }))
  registry.register(Vector4, new StructInfo({
    x: new Field(typeid(Number)),
    y: new Field(typeid(Number)),
    z: new Field(typeid(Number)),
    w: new Field(typeid(Number))
  }))
  registry.register(BVector2, new StructInfo({
    x: new Field(typeid(Boolean)),
    y: new Field(typeid(Boolean))
  }))
  registry.register(BVector3, new StructInfo({
    x: new Field(typeid(Boolean)),
    y: new Field(typeid(Boolean)),
    z: new Field(typeid(Boolean))
  }))
  registry.register(BVector4, new StructInfo({
    x: new Field(typeid(Boolean)),
    y: new Field(typeid(Boolean)),
    z: new Field(typeid(Boolean)),
    w: new Field(typeid(Boolean))
  }))
  registry.register(Matrix2, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number))
  }))
  registry.register(Matrix3, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    e: new Field(typeid(Number)),
    f: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    h: new Field(typeid(Number)),
    i: new Field(typeid(Number))
  }))
  registry.register(Matrix4, new StructInfo({
    a: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    c: new Field(typeid(Number)),
    d: new Field(typeid(Number)),
    e: new Field(typeid(Number)),
    f: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    h: new Field(typeid(Number)),
    i: new Field(typeid(Number)),
    j: new Field(typeid(Number)),
    k: new Field(typeid(Number)),
    l: new Field(typeid(Number)),
    m: new Field(typeid(Number)),
    n: new Field(typeid(Number)),
    o: new Field(typeid(Number)),
    p: new Field(typeid(Number))
  }))
}
