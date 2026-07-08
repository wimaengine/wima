/** @import {Constructor} from '@wimaengine/type' */
/** @import {Canvas2DFunction} from '../types' */
/** @import {SystemFunc} from '@wimaengine/ecs' */
import { Assets } from '@wimaengine/asset'
import { EntityHandle, Query } from '@wimaengine/ecs'
import { warn } from '@wimaengine/logger'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { Material, Mesh, TextureCache, RenderLists2D, Camera, OrthographicProjection } from '@wimaengine/render-core'
import { GlobalTransform2D } from '@wimaengine/transform'
import { MainWindow, Windows, Window } from '@wimaengine/window'

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
    const windows = new Query(world, [EntityHandle, Window, MainWindow])
    const canvases = world.getResource(Windows)
    const window = windows.single()

    if (!window) return warn('Please define the main window before.')

    const canvas = canvases.getWindow(window[0])

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const width = window[1].getWidth()
    const height = window[1].getHeight()
    const offsetX = width / 2
    const offsetY = height / 2

    if (!ctx) return warn('2d context could not be created on the canvas.')

    cameras.each(([cameraTransform, renderList, camera]) => {
      const view = GlobalTransform2D.invert(cameraTransform)

      ctx.save()

      if (camera.projection instanceof OrthographicProjection) {
        const { projection } = camera
        const projectionWidth = projection.right - projection.left
        const projectionHeight = projection.top - projection.bottom
        const projectionOffsetX = -(projection.right + projection.left) / projectionWidth
        const projectionOffsetY = -(projection.top + projection.bottom) / projectionHeight

        ctx.translate(offsetX, offsetY)
        ctx.scale(offsetX, -offsetY)
        ctx.transform(
          2 / projectionWidth,
          0,
          0,
          2 / projectionHeight,
          projectionOffsetX,
          projectionOffsetY
        )
      } else {
        throw new Error('Unsupported camera projection for 2d camera')
      }

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
        const mesh = meshes.getByAssetId(meshid)
        const material = materials.getByAssetId(materialid)

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

export * from './clear'
export * from './types'
