/** @import {SystemFunc} from '../../ecs/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */
/** @import {UniformBind} from '../../render-core/index.js' */
import { Entity, Query } from '../../ecs/index.js'
import { assert, warn } from '../../logger/index.js'
import { Windows, MainWindow, Window } from '../../window/index.js'
import { typeid, typeidGeneric } from '../../reflect/index.js'
import { AttributeMap, ClearColor, MeshCache, UBOCache, WebglProgramCache } from '../resources/index.js'
import { Camera, Material, Mesh, RenderLists3D, ShaderStage } from '../../render-core/index.js'
import { WebglRenderPipeline, createShader, validateShader, createProgram, validateProgram } from '../core/index.js'
import { Assets } from '../../asset/index.js'
import { GlobalTransform3D } from '../../transform/index.js'

/**
 * @template T
 * @param {Constructor<T>} type
 * @returns {SystemFunc}
 */
export function genRegisterBuffer(type) {
  return function registerBuffers(world) {
    const ubos = world.getResource(UBOCache)
    const canvases = world.getResource(Windows)
    const windows = new Query(world, [Entity, Window, MainWindow])

    const window = windows.single()

    if (!window) return warn('Please define the main window for rendering.')

    const canvas = canvases.getWindow(window[0])

    if (!canvas) return

    const gl = canvas.getContext('webgl2')

    if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

    ubos.create(gl, typeid(type), 32)
  }
}

/**
 * @template T
 * @param {Constructor<T>} type
 * @param {string} vertexSource 
 * @param {string} fragmentSource 
 * @returns {SystemFunc}
 */
export function genRenderPipeline(type, vertexSource, fragmentSource) {
  const materialid = typeid(type)

  return function initRenderPipeline(world) {
    const attributeMap = world.getResource(AttributeMap)
    const ubos = world.getResource(UBOCache)
    const renderpipelines = world.getResource(WebglProgramCache)
    const windows = new Query(world, [Entity, Window, MainWindow])
    const canvases = world.getResource(Windows)
    
    if (renderpipelines.has(materialid)) return
    
    const window = windows.single()

    if (!window) return warn('Please define the main window for rendering.')

    const canvas = canvases.getWindow(window[0])

    if(!canvas) return

    const gl = canvas.getContext('webgl2')

    if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

    const vertex = createShader(gl, vertexSource, ShaderStage.Vertex)
    const fragment = createShader(gl, fragmentSource, ShaderStage.Fragment)

    validateShader(gl, vertex, 'vertex')
    validateShader(gl, fragment, 'fragment')

    const program = createProgram(gl, vertex, fragment, attributeMap)
    const pipe = new WebglRenderPipeline(program)

    validateProgram(gl, program)
    ubos.create(gl, materialid, 16)
    pipe.init(gl, ubos)
    renderpipelines.set(materialid, pipe)
  }
}

/**
 * @template {Material & UniformBind} T
 * @param {Constructor<T>} type
 * @returns {SystemFunc}
 */
export function genRender(type) {
  const materialtypeid = typeid(type)
  const meshassetsid = typeidGeneric(Assets, [Mesh])
  const materialassetsid = typeidGeneric(Assets, [type])

  return function renderToWebgl(world) {

    /** @type {Assets<Mesh>} */
    const meshes = world.getResourceByTypeId(meshassetsid)

    /** @type {Assets<T>} */
    const materials = world.getResourceByTypeId(materialassetsid)

    /** @type {MeshCache<WebGLVertexArrayObject>} */
    const gpumeshes = world.getResourceByTypeId(typeid(MeshCache))
    const programs = world.getResource(WebglProgramCache)
    const ubos = world.getResource(UBOCache)
    const canvases = world.getResource(Windows)
    const windows = new Query(world, [Entity, Window, MainWindow])
    const cameras = new Query(world, [GlobalTransform3D, RenderLists3D, Camera])
    const clearColor = world.getResource(ClearColor)

    const window = windows.single()

    if (!window) return warn('Please define the main window for rendering.')

    const canvas = canvases.getWindow(window[0])

    if(!canvas) return

    const gl = canvas.getContext('webgl2')

    if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

    gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a)
    gl.clear(gl.COLOR_BUFFER_BIT)

    cameras.each(([cameraTransform, renderlist, camera]) => {
      const projection = camera.projectionMatrix()
      const cameraUniform = ubos.get('Camera')
      const camData = new Float32Array([
        ...GlobalTransform3D.toMatrix4(cameraTransform).invert(),
        ...projection
      ])

      assert(cameraUniform, 'The uniform buffer for the camera is not set up.')

      gl.bindBuffer(gl.UNIFORM_BUFFER, cameraUniform.buffer)
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, camData)

      const pipeline = programs.get(materialtypeid)

      if(!pipeline) return

      const opaquepass = renderlist.getOpaquePass(materialtypeid)

      if(!opaquepass) return
      
      for (let i = 0; i < opaquepass.length; i++) {
        const { meshid, materialid, transform } = opaquepass[i]
        const mesh = meshes.getByAssetId(meshid)
        const material = materials.getByAssetId(materialid)
        const gpumesh = gpumeshes.get(meshid)
        const data = material.asUniformBind()
        const ubo = ubos.get(materialtypeid)

        assert(ubo, `The uniform buffer for material '${materialtypeid}' is not set up.`)

        gl.useProgram(pipeline.program)
        pipeline.setUniformMatrix3x4(gl, 'model', transform)
        gl.bindBuffer(gl.UNIFORM_BUFFER, ubo.buffer)
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, data)
        gl.bindVertexArray(gpumesh)

        const indices = mesh.getIndices()

        if (indices) {
          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
        } else {
          const positions = mesh.getAttribute('position3d')

          if (positions === undefined) return

          const count = positions.data.length

          gl.drawArrays(gl.TRIANGLES, 0, count / 3)
        }
      }
    })
  }
}