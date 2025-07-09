/** @import { ComponentHook } from "../../ecs/index.js" */
import { Query, Entity } from '../../ecs/index.js'
import { Assets } from '../../asset/index.js'
import { Mesh, Meshed } from '../../render-core/index.js'
import { createVAO } from '../core/function.js'
import { MainWindow, Windows, Window } from '../../window/index.js'
import { warn } from '../../logger/index.js'
import { MeshCache, AttributeMap } from '../resources/index.js'
import { typeidGeneric } from '../../reflect/index.js'

// TODO - In the future,use the `AssetAdded` event to build gpu representation instead
// TODO - Queue the meshes instead of trying to add them immediately.
/**
 * @type {ComponentHook} 
 */
export function meshAddHook2(entity, world) {

  // SAFETY: Component is guaranteed as this is its component hook
  const handle = world.get(entity, Meshed)
  const attributeMap = world.getResource(AttributeMap)

  /** @type {Assets<Mesh>} */
  const meshes = world.getResourceByTypeId(typeidGeneric(Assets, [Mesh]))

  /** @type {MeshCache<WebGLVertexArrayObject>} */
  const meshcache = world.getResource(MeshCache)
  const windows = new Query(world, [Entity, Window, MainWindow])
  const canvases = world.getResource(Windows)

  const window = windows.single()

  if (!window) return warn('Please define the main window for rendering.')

  const canvas = canvases.getWindow(window[0])

  if(!canvas) return

  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')
  if (meshcache.has(handle.handle.id())) return

  const mesh = meshes.getByHandle(handle.handle)
  const vao = createVAO(gl, mesh, attributeMap)

  meshcache.set(handle.handle.id(), vao)
}