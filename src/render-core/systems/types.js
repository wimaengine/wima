/** @import { Constructor } from '../../type/index.js' */

import { World } from '../../ecs/index.js'
import { EnumInfo, Field, MapInfo, OpaqueInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid, typeidGeneric } from '../../type/index.js'
import { Handle, HandleSnapshot } from '../../asset/index.js'
import { Color } from '../../color/index.js'
import { Vector2 } from '../../math/index.js'
import { Camera, Meshed, MeshedSnapshot, RenderLists2D, RenderLists3D } from '../components/index.js'
import { BasicMaterial2D, BasicMaterial2DSnapshot, BasicMaterial3D, BasicMaterial3DSnapshot } from '../components/materials/index.js'
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
  registry.get(MeshAttributeData)?.setMethod(MeshAttributeData.serialize)
  registry.get(MeshAttributeData)?.setMethod(MeshAttributeData.deserialize)
  registry.register(Image, new StructInfo({
    raw: new Field(typeid(Uint8ClampedArray)),
    dimensions: new Field(typeid(Vector2))
  }))
  registry.get(Image)?.setMethod(Image.serialize)
  registry.get(Image)?.setMethod(Image.deserialize)
  registry.register(Mesh, new StructInfo({
    indices: new Field(typeid(Uint16Array), true),
    attributes: new Field(meshAttributeMapId)
  }))
  registry.get(Mesh)?.setMethod(Mesh.serialize)
  registry.get(Mesh)?.setMethod(Mesh.deserialize)
  registry.register(Shader, new StructInfo({
    stage: new Field(shaderStageId),
    source: new Field(typeid(String))
  }))
  registry.get(Shader)?.setMethod(Shader.serialize)
  registry.get(Shader)?.setMethod(Shader.deserialize)
  registry.register(BasicMaterial, new StructInfo({
    color: new Field(typeid(Color))
  }))
  registry.get(BasicMaterial)?.setMethod(BasicMaterial.serialize)
  registry.get(BasicMaterial)?.setMethod(BasicMaterial.deserialize)
  registry.register(Meshed, new StructInfo({
    handle: new Field(typeidGeneric(Handle, [Mesh]))
  }))
  registry.get(Meshed)?.setMethod(Meshed.copy)
  registry.get(Meshed)?.setMethod(Meshed.clone)
  registry.get(Meshed)?.setMethod(Meshed.prototype.toSnapshot)
  registry.register(MeshedSnapshot, new StructInfo({
    handle: new Field(typeid(HandleSnapshot))
  }))
  registry.get(MeshedSnapshot)?.setMethod(MeshedSnapshot.serialize)
  registry.get(MeshedSnapshot)?.setMethod(MeshedSnapshot.deserialize)
  registry.get(MeshedSnapshot)?.setMethod(MeshedSnapshot.prototype.fromSnapshot)
  registry.register(BasicMaterial2D, new StructInfo({
    handle: new Field(basicMaterialHandleId)
  }))
  registry.get(BasicMaterial2D)?.setMethod(BasicMaterial2D.copy)
  registry.get(BasicMaterial2D)?.setMethod(BasicMaterial2D.clone)
  registry.get(BasicMaterial2D)?.setMethod(BasicMaterial2D.prototype.toSnapshot)
  registry.register(BasicMaterial2DSnapshot, new StructInfo({
    handle: new Field(typeid(HandleSnapshot))
  }))
  registry.get(BasicMaterial2DSnapshot)?.setMethod(BasicMaterial2DSnapshot.serialize)
  registry.get(BasicMaterial2DSnapshot)?.setMethod(BasicMaterial2DSnapshot.deserialize)
  registry.get(BasicMaterial2DSnapshot)?.setMethod(BasicMaterial2DSnapshot.prototype.fromSnapshot)
  registry.register(BasicMaterial3D, new StructInfo({
    handle: new Field(basicMaterialHandleId)
  }))
  registry.get(BasicMaterial3D)?.setMethod(BasicMaterial3D.copy)
  registry.get(BasicMaterial3D)?.setMethod(BasicMaterial3D.clone)
  registry.get(BasicMaterial3D)?.setMethod(BasicMaterial3D.prototype.toSnapshot)
  registry.register(BasicMaterial3DSnapshot, new StructInfo({
    handle: new Field(typeid(HandleSnapshot))
  }))
  registry.get(BasicMaterial3DSnapshot)?.setMethod(BasicMaterial3DSnapshot.serialize)
  registry.get(BasicMaterial3DSnapshot)?.setMethod(BasicMaterial3DSnapshot.deserialize)
  registry.get(BasicMaterial3DSnapshot)?.setMethod(BasicMaterial3DSnapshot.prototype.fromSnapshot)
  registry.register(Camera, new StructInfo({
    projection: new Field(typeid(Projection)),
    near: new Field(typeid(Number)),
    far: new Field(typeid(Number))
  }))
  registry.get(Camera)?.setMethod(Camera.copy)
  registry.get(Camera)?.setMethod(Camera.clone)
  registry.get(Camera)?.setMethod(Camera.serialize)
  registry.get(Camera)?.setMethod(Camera.deserialize)

  registry.register(RenderLists2D, new OpaqueInfo())
  registry.get(RenderLists2D)?.setMethod(RenderLists2D.copy)
  registry.get(RenderLists2D)?.setMethod(RenderLists2D.clone)
  registry.get(RenderLists2D)?.setMethod(RenderLists2D.serialize)
  registry.get(RenderLists2D)?.setMethod(RenderLists2D.deserialize)

  registry.register(RenderLists3D, new OpaqueInfo())
  registry.get(RenderLists3D)?.setMethod(RenderLists3D.copy)
  registry.get(RenderLists3D)?.setMethod(RenderLists3D.clone)
  registry.get(RenderLists3D)?.setMethod(RenderLists3D.serialize)
  registry.get(RenderLists3D)?.setMethod(RenderLists3D.deserialize)
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

    if ('copy' in component && typeof component.copy === 'function') {
      registry.get(component)?.setMethod(component.copy)
    }
    if ('clone' in component && typeof component.clone === 'function') {
      registry.get(component)?.setMethod(component.clone)
    }
    if ('serialize' in component && typeof component.serialize === 'function') {
      registry.get(component)?.setMethod(component.serialize)
    }
    if ('deserialize' in component && typeof component.deserialize === 'function') {
      registry.get(component)?.setMethod(component.deserialize)
    }
  }
}
