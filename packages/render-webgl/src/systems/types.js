import { World } from '@wimaengine/ecs'
import { MapInfo, StructInfo, Field, OpaqueInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { AttributeMap, ClearColor, MeshCache, UBOCache, WebglProgramCache } from '../resources'
import { ProgramCache, MeshAttribute } from '@wimaengine/render-core'
import { WebglRenderPipeline } from '../core'

/**
 * @param {World} world
 */
export function registerWebglTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const webglProgramId = setTypeId('WebGLProgram')
  const webglVaoId = setTypeId('WebGLVertexArrayObject')

  registry.registerTypeId(webglProgramId, new OpaqueInfo())
  registry.registerTypeId(webglVaoId, new OpaqueInfo())

  registry.register(MeshAttribute, new StructInfo({
    name: new Field(typeid(String)),
    id: new Field(typeid(Number)),
    type: new Field(typeid(Number)),
    size: new Field(typeid(Number))
  }))
  registry.get(MeshAttribute)?.setMethod(MeshAttribute.serialize)
  registry.get(MeshAttribute)?.setMethod(MeshAttribute.deserialize)
  registry.register(WebglRenderPipeline, new StructInfo({
    program: new Field(webglProgramId)
  }))

  registry.register(ProgramCache, new MapInfo(typeid(Number), webglProgramId))
  registry.register(MeshCache, new MapInfo(typeid(Number), webglVaoId))
  registry.register(UBOCache, new OpaqueInfo())
  registry.register(ClearColor, new StructInfo({
    r: new Field(typeid(Number)),
    g: new Field(typeid(Number)),
    b: new Field(typeid(Number)),
    a: new Field(typeid(Number))
  }))
  registry.get(ClearColor)?.setMethod(ClearColor.serialize)
  registry.get(ClearColor)?.setMethod(ClearColor.deserialize)
  registry.register(AttributeMap, new MapInfo(typeid(String), typeid(MeshAttribute)))
  registry.register(WebglProgramCache, new MapInfo(typeid(String), typeid(WebglRenderPipeline)))
}
