/** @import { Entity } from "../ecs/index.js"; */
import { Assets, Handle } from '../asset/index.js'
import { Query, World } from '../ecs/index.js'
import { App, AppSchedule } from '../app/index.js'
import { Mesh, Material, TextureCache,Image } from '../render-core/index.js'
import { MainWindow, Window, Windows } from '../window/index.js'
import { warn } from '../logger/index.js'
import { vertices } from './utils.js'
import { Orientation2D, Position2D, Scale2D } from '../transform/index.js'
import { MaterialType } from './core/index.js'
import { CanvasImageMaterial, CanvasMeshedMaterial, CanvasTextMaterial } from './assets/materials/index.js'

export class Canvas2DRendererPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new TextureCache())
      .registerSystem(AppSchedule.Update, renderToCanvas)
  }
}

/**
 * @param {World} world
 */
function renderToCanvas(world) {

  /** @type {Assets<Mesh>} */
  const meshes = world.getResource('assets<mesh>')

  /** @type {Assets<Material>} */
  const materials = world.getResource('assets<material>')

  /** @type {Assets<Image>} */
  const images = world.getResource('assets<image>')

  /** @type {TextureCache<HTMLImageElement>} */
  const textures = world.getResource('texturecache')

  /** @type {Query<[Position2D,Orientation2D,Scale2D,Handle<Mesh>,Handle<Material>]>} */
  const query = new Query(world, ['position2d', 'orientation2d', 'scale2d', 'meshhandle', 'materialhandle'])

  /** @type {Query<[Position2D,Orientation2D,Scale2D]>} */
  const camQuery = new Query(world, ['position2d', 'orientation2d', 'scale2d', 'camera'])

  /** @type {Query<[Entity,Window,MainWindow]>} */
  const windows = new Query(world, ['entity', 'window', 'mainwindow'])

  /** @type {Windows} */
  const canvases = world.getResource('windows')

  const camera = camQuery.single()
  const window = windows.single()

  if (!window) return warn('Please define the main window before.')
  if (!camera) return warn('Please add a camera to the scene.')

  const canvas = canvases.getWindow(window[0])
  const ctx = canvas.getContext('2d')

  if (!ctx) return warn('2d context could not be created on the canvas.')
    
  const [position, orientation, scale] = camera

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.translate(
    position.x,
    position.y
  )
  ctx.rotate(
    orientation.value
  )
  ctx.scale(
    scale.x,
    scale.y
  )
  
  query.each(([position, orient, scale, meshhandle, mathandle]) => {
    const mesh = meshes.getByHandle(meshhandle)
    const material = materials.getByHandle(mathandle)

    if (/** @type {CanvasImageMaterial} */(material).type === MaterialType.Image) {
      const handle = /** @type {CanvasImageMaterial} */(material).image

      // TODO: Does this create a new `ImageElement` every frame its image is not found? 
      if (!textures.has(handle.handle)) {
        const pic = images.getByHandle(handle)
        const image = document.createElement('img')
        const blob = new Blob([pic.raw.buffer])

        image.src = URL.createObjectURL(blob)
        image.onload = () => textures.set(handle.handle, image)

        return
      }
    }

    ctx.save()
    ctx.beginPath()
    ctx.translate(position.x, position.y)
    ctx.rotate(orient.value)
    ctx.scale(scale.x, scale.y)

    renderMaterial(ctx, material, mesh, textures)

    ctx.closePath()
    ctx.restore()
  })
  ctx.restore()
}


/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Material} material
 * @param {Mesh} mesh
 * @param {TextureCache<HTMLImageElement>} textures
 */
function renderMaterial(ctx, material, mesh, textures) {

  // @ts-ignore
  // SAFETY: Ensure the material has a type property
  switch (material.type) {
    case MaterialType.Basic:
      renderBasic(ctx, /** @type {CanvasMeshedMaterial} */(material), mesh)
      break

    case MaterialType.Text:
      renderText(ctx, /** @type {CanvasTextMaterial} */(material))
      break

    case MaterialType.Image:
      renderImage(ctx, /** @type {CanvasImageMaterial} */(material), textures)
      break
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {CanvasMeshedMaterial} material
 * @param {Mesh} mesh
 */
function renderBasic(ctx, material, mesh) {
  const { fill, stroke, strokeWidth } = material
  const positions = mesh.getAttribute('position2d')?.data

  if (!positions) return

  ctx.lineWidth = strokeWidth
  ctx.fillStyle = `rgba(${fill.r},${fill.g},${fill.b},${fill.a})`
  ctx.strokeStyle = `rgba(${stroke.r},${stroke.g},${stroke.b},${stroke.a})`

  vertices(ctx, positions, true)
  ctx.stroke()
  ctx.fill()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {CanvasTextMaterial} material
 */
function renderText(ctx, material) {
  const { text, align, font, fill, stroke, strokeWidth, fontSize } = material

  ctx.textAlign = align
  ctx.lineWidth = strokeWidth
  ctx.fillStyle = `rgba(${fill.r},${fill.g},${fill.b},${fill.a})`
  ctx.strokeStyle = `rgba(${stroke.r},${stroke.g},${stroke.b},${stroke.a})`
  ctx.font = `${fontSize}px ${font}`
  ctx.textRendering = 'geometricPrecision'
  ctx.fillText(text, 0, 0)
  ctx.strokeText(text, 0, 0)
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {CanvasImageMaterial} material
 * @param {TextureCache<HTMLImageElement>} textures
 */
function renderImage(ctx, material, textures) {
  const { image, width, height, frameX, frameY, divisionX, divisionY } = material
  const texture = textures.get(image.handle)

  if (!texture) return

  const sw = texture.width / divisionX
  const sh = texture.height / divisionY

  ctx.drawImage(texture, sw * frameX, sh * frameY, sw, sh, -width / 2, -height / 2, width, height)
}