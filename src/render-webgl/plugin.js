import { App, AppSchedule, Plugin } from '../app/index.js'
import { ComponentHooks, Entity, Query, World } from '../ecs/index.js'
import { warn } from '../logger/index.js'
import { MeshAttribute, ProgramCache, BasicMaterial, Meshed } from '../render-core/index.js'
import { MainWindow, Window, Windows } from '../window/index.js'
import { meshAddHook2 } from './hooks/index.js'
import { WebglMaterialPlugin } from './plugins/index.js'
import { AttributeMap, ClearColor, MeshCache, UBOCache, WebglProgramCache } from './resources/index.js'
import { basicMaterial3DFragment, basicMaterial3DVertex } from './shaders/index.js'

export class WebglRendererPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const attribute = new AttributeMap()

    registerDefaultAttributeLocs(attribute)
    app
      .setComponentHooks(MaterialHandle, new ComponentHooks(materialAddHook))
      .setComponentHooks(MeshHandle, new ComponentHooks(meshAddHook))
      .setComponentHooks(Meshed, new ComponentHooks(meshAddHook2))
      .setResource(new ProgramCache())
      .setResource(new MeshCache())
      .setResource(new UBOCache())
      .setResource(new ClearColor())
      .setResource(attribute)
      .setResource(new WebglProgramCache())
      .registerSystem(AppSchedule.Update, registerBuffers)
      .registerSystem(AppSchedule.Update, render)
      .registerSystem(AppSchedule.Update, resizegl)
      .registerPlugin(new WebglMaterialPlugin({
        material: BasicMaterial,
        vertex3d: basicMaterial3DVertex,
        fragment3d: basicMaterial3DFragment
      }))
  }
}

/**
 * @param {AttributeMap} attributeMap
 */
function registerDefaultAttributeLocs(attributeMap) {
  attributeMap
    .set(MeshAttribute.Position2D.name, MeshAttribute.Position2D)
    .set(MeshAttribute.Position3D.name, MeshAttribute.Position3D)
    .set(MeshAttribute.Normal2D.name, MeshAttribute.Normal2D)
    .set(MeshAttribute.Normal3D.name, MeshAttribute.Normal3D)
    .set(MeshAttribute.Tangent2D.name, MeshAttribute.Tangent2D)
    .set(MeshAttribute.Tangent3D.name, MeshAttribute.Tangent3D)
    .set(MeshAttribute.UV.name, MeshAttribute.UV)
    .set(MeshAttribute.UVB.name, MeshAttribute.UVB)
    .set(MeshAttribute.Color.name, MeshAttribute.Color)
}

/**
 * @param {World} world
 */
function registerBuffers(world) {
  const ubos = world.getResource(UBOCache)
  const canvases = world.getResource(Windows)
  const windows = new Query(world, [Entity, Window, MainWindow])

  const window = windows.single()

  if (!window) return warn('Please define the main window for rendering.')


  /** @type {HTMLCanvasElement}*/
  const canvas = canvases.getWindow(window[0])

  if (!canvas) return

  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

  if (!ubos.get('Camera')) ubos.create(gl, 'Camera', 128)
  if (!ubos.get('WebglBasicMaterial')) ubos.create(gl, 'WebglBasicMaterial', 32)
}