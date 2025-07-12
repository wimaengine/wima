/** @import { Constructor } from '../../reflect/index.js' */
/** @import { SystemFunc } from '../../ecs/index.js' */
import { Entity, Query } from '../../ecs/index.js'
import {
  Gizmo2D,
  Gizmo3D,
  GizmoLineStyle,
  GizmoLineJoin,
  GizmoLineCap
} from '../core/index.js'
import { warn } from '../../logger/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Windows } from '../../window/index.js'

/**
 * @template T
 * @param {Constructor<T>} label
 * @returns {SystemFunc}
 */
export function genenerateDrawGizmo2Dsystem(label) {
  const gizmotypeid = typeidGeneric(Gizmo2D, [label])

  return function drawGizmo2D(world) {

    /** @type {Gizmo2D<T>} */
    const gizmo = world.getResourceByTypeId(gizmotypeid)
    const canvases = world.getResource(Windows)
    const window = new Query(world, [Entity, Window]).single()

    if (!window) return

    const canvas = canvases.getWindow(window[0])

    if(!canvas) return

    const context = canvas.getContext('2d')

    if (!context) return

    const {
      lineWidth,
      lineJoin,
      lineCap,
      lineStyle,
      lineDashOffset
    } = gizmo.settings

    context.save()
    context.lineWidth = lineWidth
    context.lineCap = mapCap(lineCap)
    context.lineJoin = mapJoin(lineJoin)
    context.setLineDash(mapStyle(lineStyle, lineWidth))
    context.lineDashOffset = lineDashOffset

    // Render Lines
    for (let i = 0; i < gizmo.buffer.positions.length; i += 2) {
      context.beginPath()
      const startPos = gizmo.buffer.positions[i]
      const endPos = gizmo.buffer.positions[i + 1]
      const startColor = gizmo.buffer.colors[i]
      const endColor = gizmo.buffer.colors[i + 1]

      const colorGradient = context.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y)

      colorGradient.addColorStop(0, `rgba(${startColor.r * 255},${startColor.g * 255},${startColor.b * 255},${startColor.a * 255})`)
      colorGradient.addColorStop(1, `rgba(${endColor.r * 255},${endColor.g * 255},${endColor.b * 255},${endColor.a * 255})`)

      context.moveTo(startPos.x, startPos.y)
      context.lineTo(endPos.x, endPos.y)
      context.strokeStyle = colorGradient
      context.stroke()
      context.closePath()
    }

    // Render strips.
    for (let i = 1; i < gizmo.buffer.stripPositions.length; i += 1) {
      context.beginPath()
      const startPos = gizmo.buffer.stripPositions[i - 1]
      const endPos = gizmo.buffer.stripPositions[i]
      const startColor = gizmo.buffer.stripColors[i - 1]
      const endColor = gizmo.buffer.stripColors[i]

      if (isNaN(endPos.x) || isNaN(startPos.x)) continue

      const colorGradient = context.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y)

      colorGradient.addColorStop(0, `rgba(${startColor.r * 255},${startColor.g * 255},${startColor.b * 255},${startColor.a * 255})`)
      colorGradient.addColorStop(1, `rgba(${endColor.r * 255},${endColor.g * 255},${endColor.b * 255},${endColor.a * 255})`)
      context.moveTo(startPos.x, startPos.y)
      context.lineTo(endPos.x, endPos.y)
      context.strokeStyle = colorGradient
      context.stroke()
      context.closePath()
    }

    gizmo.buffer.clear()
    context.restore()
  }
}

/**
 * @param {string} name
 */
export function genenerateDrawGizmo3Dsystem(name) {
  warn('Canvas 2d rendering backend does not support 3d gizmos.')

  return function drawGizmo3D(/** @type {World} */ world) {

    /** @type {Gizmo3D} */
    const gizmo = world.getResource(`gizmo3d<${name}>`)

    gizmo.buffer.clear()
  }
}


/**
 * @param {GizmoLineJoin} type
 * @returns {CanvasLineJoin}
 */
function mapJoin(type) {
  switch (type) {
    case GizmoLineJoin.Bevel:
      return 'bevel'

    case GizmoLineJoin.Round:
      return 'round'

    case GizmoLineJoin.Mitre:
      return 'miter'
  }

  return 'bevel'
}

/**
 * @param {GizmoLineCap} type
 * @returns {CanvasLineCap}
 */
function mapCap(type) {
  switch (type) {
    case GizmoLineCap.Square:
      return 'square'

    case GizmoLineCap.Round:
      return 'round'

    case GizmoLineCap.Butt:
      return 'butt'
  }

  return 'butt'
}

/**
 * @param {GizmoLineStyle} style
 * @param {number} width
 * @param {number} spacing
 * @returns {number[]}
 */
function mapStyle(style, width = 1, spacing = width) {
  switch (style) {
    case GizmoLineStyle.Solid:
      return []

    case GizmoLineStyle.Dashed:
      return [width, spacing]
  }

  return []
}