/** @import {Constructor} from '../../reflect/index.js' */
/** @import {Canvas2DFunction} from '../types/index.js' */
/** @import {SystemFunc} from '../../ecs/index.js' */
import { Assets } from '../../asset/index.js'
import { Entity, Query } from '../../ecs/index.js'
import { warn } from '../../logger/index.js'
import { typeidGeneric, typeid } from '../../reflect/index.js'
import { Material, Mesh, TextureCache, RenderLists2D, Camera } from '../../render-core/index.js'
import { GlobalTransform2D } from '../../transform/index.js'
import { MainWindow, Windows, Window } from '../../window/index.js'

/**
 * @template {Material} T
 * @param {Constructor<T>} type
 * @param {Canvas2DFunction<T>} renderMaterial 
 * @returns {SystemFunc} 
 */
export function genrender(type, renderMaterial) {
  const meshid = typeidGeneric(Assets, [Mesh])
  const materialid = typeidGeneric(Assets, [type])

  return function renderToCanvas2d(world) {

    /** @type {Assets<Mesh>} */
    const meshes = world.getResourceByTypeId(meshid)

    /** @type {Assets<T>} */
    const materials = world.getResourceByTypeId(materialid)

    /** @type {TextureCache<HTMLImageElement>} */
    const textures = world.getResourceByTypeId(typeid(TextureCache))
    const cameras = new Query(world, [GlobalTransform2D, RenderLists2D, Camera])
    const windows = new Query(world, [Entity, Window, MainWindow])
    const canvases = world.getResource(Windows)
    const window = windows.single()

    if (!window) return warn('Please define the main window before.')

    const canvas = canvases.getWindow(window[0])

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const offsetX = window[1].getWidth() / 2
    const offsetY = window[1].getHeight() / 2

    if (!ctx) return warn('2d context could not be created on the canvas.')

    // TODO: Return when this becomes default rendering system
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    cameras.each(([cameraTransform, renderList]) => {
      const view = GlobalTransform2D.invert(cameraTransform)

      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.transform(
        view.a,
        view.b,
        view.c,
        view.d,
        view.x,
        view.y
      )

      const list = renderList.getOpaquePass(typeid(type)) || renderList.setOpaquePass(typeid(type))

      for (let i = 0; i < list.length; i++) {
        const { materialid, meshid, transform } = list[i]
        const mesh = meshes.getById(meshid)
        const material = materials.getById(materialid)

        if (!material || !mesh) continue

        ctx.save()
        ctx.beginPath()
        ctx.transform(
          transform.a,
          transform.b,
          transform.c,
          transform.d,
          transform.x,
          transform.y
        )

        renderMaterial(ctx, material, mesh, textures)

        ctx.closePath()
        ctx.restore()
      }

      ctx.restore()
    })
  }
}