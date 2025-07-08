/** @import {SystemFunc} from '../../ecs/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */
import { Entity, Query } from '../../ecs/index.js'
import { warn } from '../../logger/index.js'
import { Windows, MainWindow, Window } from '../../window/index.js'
import { typeid } from '../../reflect/index.js'
import { AttributeMap, UBOCache, WebglProgramCache } from '../resources/index.js'
import { ShaderStage } from '../../render-core/index.js'
import { WebglRenderPipeline, createShader, validateShader, createProgram, validateProgram } from '../core/index.js'

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