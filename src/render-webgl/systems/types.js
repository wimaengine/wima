import { World } from '../../ecs/index.js'
import { MapInfo, StructInfo, Field, OpaqueInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid } from '../../type/index.js'
import { AttributeMap, ClearColor, MeshCache, UBOCache, WebglProgramCache } from '../resources/index.js'
import { ProgramCache } from '../../render-core/index.js'
import { MeshAttribute } from '../../render-core/index.js'
import { WebglRenderPipeline } from '../core/renderpipeline.js'

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
  registry.register(AttributeMap, new MapInfo(typeid(String), typeid(MeshAttribute)))
  registry.register(WebglProgramCache, new MapInfo(typeid(String), typeid(WebglRenderPipeline)))
}
