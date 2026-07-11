/** @import { Canvas2DFunction } from '../types' */

import { BasicMaterial } from '@wimaengine/render-core'
import { vertices } from '../utils'

/**
 * @type {Canvas2DFunction<BasicMaterial>}
 */
export function renderBasicMaterial(ctx, material, mesh) {
  const { color } = material
  const positions = mesh.getAttribute('position2d')?.data

  if (!positions) return

  ctx.fillStyle = `rgb(${color.r * 255},${color.g * 255},${color.b * 255})`

  // ctx.globalAlpha = color.a

  vertices(ctx, positions, true)
  ctx.fill()
}
