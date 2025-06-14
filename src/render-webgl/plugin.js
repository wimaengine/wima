import { App, AppSchedule, Plugin } from '../app/index.js'
import { Assets } from '../asset/index.js'
import { ComponentHooks, Entity, Query, World } from '../ecs/index.js'
import { Events } from '../event/index.js'
import { assert, warn } from '../logger/index.js'
import { typeid, typeidGeneric } from '../reflect/index.js'
import { MeshAttribute, Camera, Material, MaterialHandle, Mesh, MeshHandle, ProgramCache } from '../render-core/index.js'
import { GlobalTransform3D } from '../transform/index.js'
import { MainWindow, Window, WindowResize, Windows } from '../window/index.js'
import { materialAddHook, meshAddHook } from './hooks/index.js'
import { AttributeMap, ClearColor, MeshCache, UBOCache } from './resources/index.js'

export class WebglRendererPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const attribute = new AttributeMap()

    registerDefaultAttributeLocs(attribute)
    app
      .setResource(new ProgramCache())
      .setResource(new MeshCache())
      .setResource(new UBOCache())
      .setResource(new ClearColor())
      .setResource(attribute)
      .registerSystem(AppSchedule.Update, render)
      .registerSystem(AppSchedule.Update, resizegl)
      .registerSystem(AppSchedule.Startup, registerBuffers)
      .setComponentHooks(MaterialHandle, new ComponentHooks(materialAddHook))
      .setComponentHooks(MeshHandle, new ComponentHooks(meshAddHook))
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
function render(world) {

  /** @type {Assets<Mesh>} */
  const meshes = world.getResourceByTypeId(typeidGeneric(Assets, [Mesh]))

  /** @type {Assets<Material>} */
  const materials = world.getResourceByTypeId(typeidGeneric(Assets, [Material]))

  /** @type {ProgramCache<WebGLProgram>} */
  const programs = world.getResourceByTypeId(typeid(ProgramCache))

  /** @type {MeshCache<WebGLVertexArrayObject>} */
  const gpumeshes = world.getResourceByTypeId(typeid(MeshCache))
  const ubos = world.getResource(UBOCache)
  const canvases = world.getResource(Windows)
  const clearColor = world.getResource(ClearColor)
  const query = new Query(world, [GlobalTransform3D, MeshHandle, MaterialHandle])
  const windows = new Query(world, [Entity, Window, MainWindow])
  const cameras = new Query(world, [GlobalTransform3D, Camera])

  const window = windows.single()

  if (!window) return warn('Please define the main window for rendering.')

  const canvas = canvases.getWindow(window[0])
  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

  gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a)
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  cameras.each(([transform, camera]) => {
    const projection = camera.projectionMatrix()
    const cameraUniform = ubos.get('Camera')
    const camData = new Float32Array([
      ...transform.toMatrix4().inverse(),
      ...projection
    ])

    assert(cameraUniform, 'The uniform buffer for the camera is not set up.')
    gl.bindBuffer(gl.UNIFORM_BUFFER, cameraUniform.buffer)
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, camData)

    query.each(([transform, meshhandle, materialhandle]) => {
      const mesh = meshes.getByHandle(meshhandle)
      const material = materials.getByHandle(materialhandle)
      const gpumesh = gpumeshes.get(meshhandle.handle)
      const pipeline = programs.get(materialhandle.handle)

      // @ts-ignore
      // SAFETY: BasicMaterial has the method.
      // To ensure that this works on all materials,make `Material` have this method.
      const data = material.asUniformBind()
      const ubo = ubos.get(material.constructor.name)

      assert(ubo, `The uniform buffer for material '${material.constructor.name}' is not set up.` )

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
    })
  })
}

/**
 * @param {World} world
 */
function resizegl(world) {
  const windows = new Query(world, [Entity, Window, MainWindow])

  /** @type {Windows} */
  const canvases = world.getResource(Windows)

  /** @type {Events<WindowResize>} */
  const resizeEvents = world.getResourceByTypeId(typeidGeneric(Events, [WindowResize]))

  const window = windows.single()

  if (!window) return

  const canvas = canvases.getWindow(window[0])
  const gl = canvas.getContext('webgl2')

  if (!gl) return

  resizeEvents.each((ev) => {
    gl.viewport(0, 0, ev.data.width, ev.data.height)
  })
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
  const gl = canvas.getContext('webgl2')

  if (!gl) return warn('WebGL 2.0 context is not created or is lost.')

  ubos.create(gl, 'Camera', 128)
  ubos.create(gl, 'WebglBasicMaterial', 32)
}