/** @import { Constructor } from '@wimaengine/type' */

import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { Color } from '@wimaengine/color'
import { World } from '@wimaengine/ecs'
import { Vector2 } from '@wimaengine/math'
import { EnumInfo, Field, MapInfo, OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { BasicMaterial, Image, Material, Mesh, Shader } from '../assets'
import { BasicMaterialInstance, BasicMaterialInstanceSnapshot, Camera, Meshed, MeshedSnapshot, RenderLists2D, RenderLists3D } from '../components'
import { MeshAttributeData, Projection, ShaderStage } from '../core'

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
  registry.register(BasicMaterialInstance, new StructInfo({
    handle: new Field(basicMaterialHandleId)
  }))
  registry.get(BasicMaterialInstance)?.setMethod(BasicMaterialInstance.copy)
  registry.get(BasicMaterialInstance)?.setMethod(BasicMaterialInstance.clone)
  registry.get(BasicMaterialInstance)?.setMethod(BasicMaterialInstance.prototype.toSnapshot)
  registry.register(BasicMaterialInstanceSnapshot, new StructInfo({
    handle: new Field(typeid(HandleSnapshot))
  }))
  registry.get(BasicMaterialInstanceSnapshot)?.setMethod(BasicMaterialInstanceSnapshot.serialize)
  registry.get(BasicMaterialInstanceSnapshot)?.setMethod(BasicMaterialInstanceSnapshot.deserialize)
  registry.get(BasicMaterialInstanceSnapshot)?.setMethod(BasicMaterialInstanceSnapshot.prototype.fromSnapshot)
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
 * @returns {import('@wimaengine/ecs').SystemFunc}
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
