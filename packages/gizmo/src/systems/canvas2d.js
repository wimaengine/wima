/** @import { Constructor } from '@wimaengine/type' */
/** @import { SystemFunc } from '@wimaengine/ecs' */
import { EntityHandle, Query } from '@wimaengine/ecs'
import { warn } from '@wimaengine/logger'
import { Camera, OrthographicProjection, RenderLists2D } from '@wimaengine/render-core'
import { GlobalTransform2D } from '@wimaengine/transform'
import { typeidGeneric } from '@wimaengine/type'
import { Windows, Window } from '@wimaengine/window'
import {
  Gizmo2D,
  Gizmo3D,
  GizmoLineStyle,
  GizmoLineJoin,
  GizmoLineCap,
  GizmoTextAlign
} from '../core'

/**
 * Creates the canvas drawing system for a labelled {@linkcode Gizmo2D} resource.
 *
 * This is an ordinary system factory. It does not register a plugin or a
 * system itself; {@linkcode Gizmo2DPlugin} calls it and registers the returned
 * function in {@linkcode AppSchedule.Update}. The `label` is combined with
 * `Gizmo2D` through `typeidGeneric(Gizmo2D, [label])`, so it must be the same
 * constructor used when the gizmo resource was installed.
 *
 * Each invocation looks up that resource, the {@linkcode Windows} canvas resource,
 * the first entity matching `[EntityHandle, Window]`, and the first entity matching
 * `[GlobalTransform2D, RenderLists2D, Camera]`. With the default
 * {@linkcode WindowPlugin} setup, this is the primary window entity. The query
 * does not require the `MainWindow` marker, so applications that manage their
 * own windows can provide any matching `Window` entity. `Windows` must contain
 * a canvas for the entity, as provided by {@linkcode DOMWindowPlugin}; the canvas
 * must also expose a 2D rendering context. The camera must use an
 * {@linkcode OrthographicProjection}; gizmo positions are interpreted as world
 * coordinates and transformed into canvas space using that camera.
 *
 * The system returns without drawing when there is no matching window, camera,
 * orthographic projection, canvas mapped to that window, or 2D context. These early returns leave
 * the gizmo buffer unchanged. A labelled {@linkcode Gizmo2D} resource and the
 * {@linkcode Windows} resource are required by the world; the factory does not
 * install either one.
 *
 * Before drawing, the system maps {@linkcode GizmoSettings} to the canvas context:
 * line width, cap, join, dash pattern, and dash offset. Entries in
 * {@linkcode GizmoBuffer#positions} and {@linkcode GizmoBuffer#colors} are consumed in
 * pairs as independent gradient lines. Entries in
 * {@linkcode GizmoBuffer#polylinePositions} and {@linkcode GizmoBuffer#polylineColors} are
 * consumed as adjacent pairs; the NaN sentinel written by
 * {@linkcode Gizmo2D#polyline} and {@linkcode Gizmo2D#polylineGradient} prevents a segment from connecting separate polylines.
 * Entries in {@linkcode GizmoBuffer#fillPositions} are consumed as
 * sentinel-delimited triangle strips. The first corresponding color in
 * {@linkcode GizmoBuffer#fillColors} is used for the entire strip.
 * Entries in {@linkcode GizmoBuffer#texts} and
 * {@linkcode GizmoBuffer#fillTexts} are rendered with their corresponding affine
 * transforms, colors, and horizontal alignments after all shape geometry.
 * Each entry also supplies its font size.
 * After a successful draw, the buffer is cleared and the canvas state is
 * restored. The returned {@linkcode SystemFunc} accepts a world and returns
 * `undefined`.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { genenerateDrawGizmo2Dsystem } from '@wimaengine/gizmo'
 *
 * class PhysicsDebug {}
 * const drawPhysicsGizmo = genenerateDrawGizmo2Dsystem(PhysicsDebug)
 * app.registerSystem({ schedule: AppSchedule.Update, system: drawPhysicsGizmo })
 * ```
 *
 * @template T
 * @param {Constructor<T>} label
 * @returns {SystemFunc} A system that draws the labelled gizmo on the active canvas.
 */
export function genenerateDrawGizmo2Dsystem(label) {
  const gizmotypeid = typeidGeneric(Gizmo2D, [label])

  return function drawGizmo2D(world) {

    /** @type {Gizmo2D<T>} */
    const gizmo = world.getResourceByTypeId(gizmotypeid)
    const canvases = world.getResource(Windows)
    const window = new Query(world, [EntityHandle, Window]).single()
    const camera = new Query(world, [GlobalTransform2D, RenderLists2D, Camera]).single()

    if (!window || !camera) return

    const canvas = canvases.getWindow(window[0])

    if (!canvas) return

    const context = canvas.getContext('2d')

    if (!context) return

    const width = window[1].getWidth()
    const height = window[1].getHeight()
    const offsetX = width / 2
    const offsetY = height / 2
    const cameraTransform = GlobalTransform2D.invert(camera[0])
    const { projection } = camera[2]

    if (!(projection instanceof OrthographicProjection)) return

    const {
      lineWidth,
      lineJoin,
      lineCap,
      lineStyle,
      lineDashOffset
    } = gizmo.settings

    context.save()
    const projectionWidth = projection.right - projection.left
    const projectionHeight = projection.top - projection.bottom
    const projectionOffsetX = -(projection.right + projection.left) / projectionWidth
    const projectionOffsetY = -(projection.top + projection.bottom) / projectionHeight

    context.translate(offsetX, offsetY)
    context.scale(offsetX, -offsetY)
    context.transform(
      2 / projectionWidth,
      0,
      0,
      2 / projectionHeight,
      projectionOffsetX,
      projectionOffsetY
    )
    context.transform(
      cameraTransform.a,
      cameraTransform.b,
      cameraTransform.c,
      cameraTransform.d,
      cameraTransform.x,
      cameraTransform.y
    )
    context.lineWidth = lineWidth
    context.lineCap = mapCap(lineCap)
    context.lineJoin = mapJoin(lineJoin)
    context.setLineDash(mapStyle(lineStyle, lineWidth))
    context.lineDashOffset = lineDashOffset

    // Render filled triangle strips.
    let fillStart = 0
    for (let i = 0; i <= gizmo.buffer.fillPositions.length; i += 1) {
      const position = gizmo.buffer.fillPositions[i]
      const isEnd = i === gizmo.buffer.fillPositions.length || isNaN(position.x)
      if (!isEnd) continue

      const color = gizmo.buffer.fillColors[fillStart]
      if (color && i - fillStart >= 3) {
        context.fillStyle = `rgba(${color.r * 255},${color.g * 255},${color.b * 255},${color.a})`
        context.beginPath()

        for (let j = fillStart + 2; j < i; j += 1) {
          const first = gizmo.buffer.fillPositions[j - 2]
          const second = gizmo.buffer.fillPositions[j - 1]
          const third = gizmo.buffer.fillPositions[j]

          context.moveTo(first.x, first.y)
          context.lineTo(second.x, second.y)
          context.lineTo(third.x, third.y)
          context.closePath()
        }

        context.fill()
      }

      fillStart = i + 1
    }

    // Render Lines
    for (let i = 0; i < gizmo.buffer.positions.length; i += 2) {
      context.beginPath()
      const startPos = gizmo.buffer.positions[i]
      const endPos = gizmo.buffer.positions[i + 1]
      const startColor = gizmo.buffer.colors[i]
      const endColor = gizmo.buffer.colors[i + 1]

      const colorGradient = context.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y)

      colorGradient.addColorStop(0, `rgba(${startColor.r * 255},${startColor.g * 255},${startColor.b * 255},${startColor.a})`)
      colorGradient.addColorStop(1, `rgba(${endColor.r * 255},${endColor.g * 255},${endColor.b * 255},${endColor.a})`)

      context.moveTo(startPos.x, startPos.y)
      context.lineTo(endPos.x, endPos.y)
      context.strokeStyle = colorGradient
      context.stroke()
      context.closePath()
    }

    // Render polylines.
    for (let i = 1; i < gizmo.buffer.polylinePositions.length; i += 1) {
      context.beginPath()
      const startPos = gizmo.buffer.polylinePositions[i - 1]
      const endPos = gizmo.buffer.polylinePositions[i]
      const startColor = gizmo.buffer.polylineColors[i - 1]
      const endColor = gizmo.buffer.polylineColors[i]

      if (isNaN(endPos.x) || isNaN(startPos.x)) continue

      const colorGradient = context.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y)

      colorGradient.addColorStop(0, `rgba(${startColor.r * 255},${startColor.g * 255},${startColor.b * 255},${startColor.a})`)
      colorGradient.addColorStop(1, `rgba(${endColor.r * 255},${endColor.g * 255},${endColor.b * 255},${endColor.a})`)
      context.moveTo(startPos.x, startPos.y)
      context.lineTo(endPos.x, endPos.y)
      context.strokeStyle = colorGradient
      context.stroke()
      context.closePath()
    }

    // Render stroked text.
    for (let i = 0; i < gizmo.buffer.texts.length; i += 1) {
      const affine = gizmo.buffer.textAffines[i]
      const color = gizmo.buffer.textColors[i]

      context.save()
      context.transform(affine.a, affine.b, affine.c, affine.d, affine.x, affine.y)
      context.scale(1, -1)
      context.textAlign = mapTextAlign(gizmo.buffer.textAlignments[i])
      context.font = `${gizmo.buffer.textSizes[i]}px sans-serif`
      context.strokeStyle = `rgba(${color.r * 255},${color.g * 255},${color.b * 255},${color.a})`
      context.strokeText(gizmo.buffer.texts[i], 0, 0)
      context.restore()
    }

    // Render filled text.
    for (let i = 0; i < gizmo.buffer.fillTexts.length; i += 1) {
      const affine = gizmo.buffer.fillTextAffines[i]
      const color = gizmo.buffer.fillTextColors[i]

      context.save()
      context.transform(affine.a, affine.b, affine.c, affine.d, affine.x, affine.y)
      context.scale(1, -1)
      context.textAlign = mapTextAlign(gizmo.buffer.fillTextAlignments[i])
      context.font = `${gizmo.buffer.fillTextSizes[i]}px sans-serif`
      context.fillStyle = `rgba(${color.r * 255},${color.g * 255},${color.b * 255},${color.a})`
      context.fillText(gizmo.buffer.fillTexts[i], 0, 0)
      context.restore()
    }

    gizmo.buffer.clear()
    context.restore()
  }
}

/**
 * Creates the canvas-2D fallback system for a labelled {@linkcode Gizmo3D} resource.
 *
 * Canvas 2D cannot render 3D gizmos, so this factory calls {@linkcode warn} immediately
 * when it is created. The `label` is combined with `Gizmo3D` through
 * `typeidGeneric(Gizmo3D, [label])`; use the same constructor that identifies the
 * resource installed in the world.
 *
 * The returned system looks up that labelled {@linkcode Gizmo3D} resource, clears its
 * {@linkcode GizmoBuffer} every time it runs, and performs no rendering. It accepts a
 * world and returns `undefined`. The factory does not install the resource or
 * register the returned system in a schedule.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { genenerateDrawGizmo3Dsystem } from '@wimaengine/gizmo'
 *
 * class PhysicsDebug {}
 * const discardPhysicsGizmo = genenerateDrawGizmo3Dsystem(PhysicsDebug)
 * app.registerSystem({ schedule: AppSchedule.Update, system: discardPhysicsGizmo })
 * ```
 *
 * @template T
 * @param {Constructor<T>} label
 * @returns {SystemFunc} A system that clears the labelled 3D gizmo buffer without rendering.
 */
export function genenerateDrawGizmo3Dsystem(label) {
  warn('Canvas 2d rendering backend does not support 3d gizmos.')
  const gizmotypeid = typeidGeneric(Gizmo3D, [label])

  return function drawGizmo3D(world) {

    /** @type {Gizmo3D<T>} */
    const gizmo = world.getResourceByTypeId(gizmotypeid)

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

/**
 * @param {GizmoTextAlign} align
 * @returns {CanvasTextAlign}
 */
function mapTextAlign(align) {
  switch (align) {
    case GizmoTextAlign.Center:
      return 'center'

    case GizmoTextAlign.Right:
      return 'right'

    case GizmoTextAlign.Left:
      return 'left'
  }

  return 'left'
}
