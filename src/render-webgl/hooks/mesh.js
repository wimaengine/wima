/** @import { ComponentHook } from "../../ecs/index.js" */
import { Query, Entity } from '../../ecs/index.js'
import { Assets, Handle } from '../../asset/index.js'
import { Mesh } from '../../render-core/index.js'
import { createVAO } from '../core/function.js'
import { MainWindow, Windows, Window } from '../../window/index.js'
import { warn } from '../../logger/index.js'
import { MeshCache, AttributeMap } from '../resources/index.js'

// TODO - In the future,use the `AssetAdded` event to build gpu representation instead

/**
 * @type {ComponentHook} 
 */
export function meshAddHook(entity, world) {
  const attributeMap = world.getResource(AttributeMap)

  /** @type {Handle<Mesh>} */
  const handle = world.get(entity, 'meshhandle')

  /** @type {Assets<Mesh>} */
  const meshes = world.getResourceByName('assets<mesh>')

  /** @type {MeshCache<WebGLVertexArrayObject>} */
  const meshcache = world.getResourceByName('meshcache')
  const windows = new Query(world, [Entity, Window, MainWindow])
  const canvases = world.getResource(Windows)

  const window = windows.single()

  if (!window) return warn('Please define the main window for rendering.')

  const canvas = canvases.getWindow(window[0])
  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')
  if (meshcache.has(handle.index)) return

  const mesh = meshes.getByHandle(handle)
  const vao = createVAO(gl, mesh, attributeMap)

  meshcache.set(handle.index, vao)
}