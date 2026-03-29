/** @import { Constructor } from '../../type/index.js' */

import { World } from '../../ecs/index.js'
import { EnumInfo, Field, MapInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid, typeidGeneric } from '../../type/index.js'
import { Handle } from '../../asset/index.js'
import { Color } from '../../color/index.js'
import { Vector2 } from '../../math/index.js'
import { Camera, Meshed } from '../components/index.js'
import { BasicMaterial2D, BasicMaterial3D } from '../components/materials/index.js'
import { MeshAttributeData } from '../core/attributedata.js'
import { Projection, ShaderStage } from '../core/index.js'
import { BasicMaterial, Image, Material, Mesh, Shader } from '../assets/index.js'

/**
 * @param {World} world
 */
export function registerRenderCoreTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const meshAttributeMapId = typeidGeneric(Map, [String, MeshAttributeData])
  const shaderStageId = setTypeId('ShaderStage')
  const basicMaterialHandleId = typeidGeneric(Handle, [BasicMaterial])

  registry.registerTypeId(meshAttributeMapId, new MapInfo(typeid(String), typeid(MeshAttributeData)))
  registry.registerTypeId(shaderStageId, new EnumInfo(ShaderStage))

  registry.register(MeshAttributeData, new StructInfo({
    data: new Field(typeid(Float32Array))
  }))
  registry.register(Image, new StructInfo({
    raw: new Field(typeid(Uint8ClampedArray)),
    dimensions: new Field(typeid(Vector2))
  }))
  registry.register(Mesh, new StructInfo({
    indices: new Field(typeid(Uint16Array), true),
    attributes: new Field(meshAttributeMapId)
  }))
  registry.register(Shader, new StructInfo({
    stage: new Field(shaderStageId),
    source: new Field(typeid(String))
  }))
  registry.register(BasicMaterial, new StructInfo({
    color: new Field(typeid(Color))
  }))
  registry.register(Meshed, new StructInfo({
    handle: new Field(typeidGeneric(Handle, [Mesh]))
  }))
  registry.get(Meshed)?.setMethod(Meshed.copy)
  registry.get(Meshed)?.setMethod(Meshed.clone)
  registry.register(BasicMaterial2D, new StructInfo({
    handle: new Field(basicMaterialHandleId)
  }))
  registry.get(BasicMaterial2D)?.setMethod(BasicMaterial2D.copy)
  registry.get(BasicMaterial2D)?.setMethod(BasicMaterial2D.clone)
  registry.register(BasicMaterial3D, new StructInfo({
    handle: new Field(basicMaterialHandleId)
  }))
  registry.get(BasicMaterial3D)?.setMethod(BasicMaterial3D.copy)
  registry.get(BasicMaterial3D)?.setMethod(BasicMaterial3D.clone)
  registry.register(Camera, new StructInfo({
    projection: new Field(typeid(Projection)),
    near: new Field(typeid(Number)),
    far: new Field(typeid(Number))
  }))
  registry.get(Camera)?.setMethod(Camera.copy)
  registry.get(Camera)?.setMethod(Camera.clone)
}

/**
 * @template T
 * @template {Material} U
 * @param {Constructor<T>} component
 * @param {Constructor<U>} material
 * @returns {import('../../ecs/index.js').SystemFunc}
 */
export function registerMaterialTypes(component, material) {
  return function registerMaterialTypes(world) {
    const registry = world.getResource(TypeRegistry)

    const handleTypeId = typeidGeneric(Handle, [material])

    registry.registerTypeId(handleTypeId, new StructInfo({
      type: new Field(typeid(Function)),
      index: new Field(typeid(Number)),
      generation: new Field(typeid(Number))
    }))
    registry.register(component, new StructInfo({
      handle: new Field(handleTypeId)
    }))
    if ("copy" in component && typeof component["copy"] === 'function') {
      registry.get(component)?.setMethod(component["copy"])
    }
    if ("clone" in component && typeof component["clone"] === 'function') {
      registry.get(component)?.setMethod(component["clone"])
    }
  }
}
