/** @import {ComponentHook } from "../../ecs/index.js" */
import { Query, Entity } from '../../ecs/index.js'
import { Assets } from '../../asset/index.js'
import { Material, MaterialHandle, ProgramCache, ShaderStage } from '../../render-core/index.js'
import { createShader, createProgram, validateProgram, validateShader, WebglRenderPipeline } from '../core/index.js'
import { MainWindow, Windows, Window } from '../../window/index.js'
import { warn } from '../../logger/index.js'
import { AttributeMap, UBOCache } from '../resources/index.js'


// TODO - In the future,use the `AssetAdded` event to build gpu representation instead
/**
 * @type {ComponentHook} 
 */
export function materialAddHook(entity, world) {

  // SAFETY: Component is guaranteed as this is its component hook
  const handle = /** @type {MaterialHandle}*/(world.get(entity, MaterialHandle))
  
  const attributeMap = world.getResource(AttributeMap)
  const ubos = world.getResource(UBOCache)

  /** @type {Assets<Material>} */
  const materials = world.getResourceByName('assets<material>')

  /** @type {ProgramCache<WebGLProgram>} */
  const renderpipelines = world.getResourceByName('programcache')

  const windows = new Query(world, [Entity, Window, MainWindow])

  /** @type {Windows} */
  const canvases = world.getResource(Windows)

  const window = windows.single()

  if (!window) return warn('Please define the main window for rendering.')

  /** @type {HTMLCanvasElement}*/
  const canvas = canvases.getWindow(window[0])
  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')
  if (renderpipelines.has(handle.handle)) return

  const material = materials.getByHandle(handle)
  const vertex = createShader(gl, material.vertex(), ShaderStage.Vertex)
  const fragment = createShader(gl, material.fragment(), ShaderStage.Fragment)

  validateShader(gl, vertex, 'vertex')
  validateShader(gl, fragment, 'fragment')

  const program = createProgram(gl, vertex, fragment, attributeMap)
  const pipe = new WebglRenderPipeline(program)

  validateProgram(gl, program)
  pipe.init(gl, ubos)
  renderpipelines.set(handle.handle, pipe)
}