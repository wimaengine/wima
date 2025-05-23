import { App, AppSchedule } from '../app/index.js'
import { Assets } from '../asset/index.js'
import { ComponentHooks, Entity, Query, World } from '../ecs/index.js'
import { EventDispatch } from '../event/index.js'
import { assert, warn } from '../logger/index.js'
import { Camera, Material, MaterialHandle, Mesh, MeshHandle, ProgramCache } from '../render-core/index.js'
import { GlobalTransform3D } from '../transform/index.js'
import { MainWindow, Window, WindowResize, Windows } from '../window/index.js'
import { materialAddHook, meshAddHook } from './hooks/index.js'
import { AttributeMap, ClearColor, MeshCache, UBOCache } from './resources/index.js'

export class WebglRendererPlugin {

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
    .set(Mesh.Position2DLocation.name, Mesh.Position2DLocation)
    .set(Mesh.Position3DLocation.name, Mesh.Position3DLocation)
    .set(Mesh.Normal2DLocation.name, Mesh.Normal2DLocation)
    .set(Mesh.Normal3DLocation.name, Mesh.Normal3DLocation)
    .set(Mesh.Tangent2DLocation.name, Mesh.Tangent2DLocation)
    .set(Mesh.Tangent3DLocation.name, Mesh.Tangent3DLocation)
    .set(Mesh.UVLocation.name, Mesh.UVLocation)
    .set(Mesh.UVBLocation.name, Mesh.UVBLocation)
    .set(Mesh.ColorLocation.name, Mesh.ColorLocation)
}

/**
 * @param {World} world
 */
function render(world) {

  /** @type {Assets<Mesh>} */
  const meshes = world.getResourceByName('assets<mesh>')

  /** @type {Assets<Material>} */
  const materials = world.getResourceByName('assets<material>')

  /** @type {ProgramCache<WebGLProgram>} */
  const programs = world.getResourceByName('programcache')

  /** @type {MeshCache<WebGLVertexArrayObject>} */
  const gpumeshes = world.getResourceByName('meshcache')
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

  /** @type {EventDispatch<WindowResize>} */
  const resizeEvents = world.getResourceByName('events<windowresize>')

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