/** @import { Constructor } from '@wimaengine/type' */
import { Color } from '@wimaengine/color'
import { Affine2, Affine3, Vector2, Vector3, BVector2, TAU, Rotary } from '@wimaengine/math'
import { GizmoSettings, GizmoTextAlign } from './settings'

/**
 * Collects positions and colors for immediate-mode drawing.
 *
 * A {@linkcode Gizmo2D} or {@linkcode Gizmo3D} resource uses this buffer to submit
 * its drawing data.
 * The generic type is the owning resource's position type. Use `Vector2` in 2D gizmos and `Vector3` in 3D gizmos.
 *
 * Positions are stored in {@linkcode GizmoBuffer#positions}, and matching colors
 * are stored in {@linkcode GizmoBuffer#colors}. The renderer reads
 * these arrays in pairs. Strip positions and colors are stored in
 * {@linkcode GizmoBuffer#polylinePositions} and {@linkcode GizmoBuffer#polylineColors}; a
 * polyline is ended by the NaN sentinel that the gizmo helpers append.
 * Filled triangle-strip positions and colors are stored in
 * {@linkcode GizmoBuffer#fillPositions} and {@linkcode GizmoBuffer#fillColors}; a
 * strip is ended by the same NaN sentinel convention.
 * Text, text transforms, and text colors are stored in
 * {@linkcode GizmoBuffer#texts}, {@linkcode GizmoBuffer#textAffines}, and
 * {@linkcode GizmoBuffer#textColors}, and {@linkcode GizmoBuffer#textAlignments};
 * text sizes are stored in {@linkcode GizmoBuffer#textSizes};
 * filled text uses the corresponding {@linkcode GizmoBuffer#fillTexts},
 * {@linkcode GizmoBuffer#fillTextAffines}, {@linkcode GizmoBuffer#fillTextColors},
 * {@linkcode GizmoBuffer#fillTextAlignments}, and {@linkcode GizmoBuffer#fillTextSizes}
 * arrays.
 *
 * A gizmo resource owns its buffer, so application code normally adds drawing
 * through methods such as {@linkcode Gizmo2D#line} or
 * {@linkcode Gizmo2D#polyline} rather than pushing directly. Call
 * {@linkcode GizmoBuffer#clear} to discard the current drawing data. It sets the
 * length of all twelve arrays to `0`, preserving the array instances and
 * returning `undefined`.
 *
 * @template T
 *
 * @example
 * ```js
 * const buffer = gizmo.buffer
 * buffer.positions.push(start, end)
 * buffer.colors.push(Color.WHITE, Color.WHITE)
 * buffer.clear() // empties all six arrays
 * ```
 */
export class GizmoBuffer {

  /**
   * @type {T[]}
   */
  positions = []

  /**
   * @type {Color[]}
   */
  colors = []

  /**
   * @type {T[]}
   */
  polylinePositions = []

  /**
   * @type {Color[]}
   */
  polylineColors = []

  /**
   * Vertex positions for filled triangle strips.
   *
   * @type {T[]}
   */
  fillPositions = []

  /**
   * Colors corresponding to {@linkcode GizmoBuffer#fillPositions}.
   *
   * @type {Color[]}
   */
  fillColors = []

  /**
   * Text strings rendered with the canvas stroke-text operation.
   *
   * @type {string[]}
   */
  texts = []

  /**
   * Affine transforms corresponding to {@linkcode GizmoBuffer#texts}.
   *
   * @type {Affine2[]}
   */
  textAffines = []

  /**
   * Colors corresponding to {@linkcode GizmoBuffer#texts}.
   *
   * @type {Color[]}
   */
  textColors = []

  /**
   * Horizontal alignments corresponding to {@linkcode GizmoBuffer#texts}.
   *
   * @type {GizmoTextAlign[]}
   */
  textAlignments = []

  /**
   * Font sizes corresponding to {@linkcode GizmoBuffer#texts}.
   *
   * @type {number[]}
   */
  textSizes = []

  /**
   * Text strings rendered with the canvas fill-text operation.
   *
   * @type {string[]}
   */
  fillTexts = []

  /**
   * Affine transforms corresponding to {@linkcode GizmoBuffer#fillTexts}.
   *
   * @type {Affine2[]}
   */
  fillTextAffines = []

  /**
   * Colors corresponding to {@linkcode GizmoBuffer#fillTexts}.
   *
   * @type {Color[]}
   */
  fillTextColors = []

  /**
   * Horizontal alignments corresponding to {@linkcode GizmoBuffer#fillTexts}.
   *
   * @type {GizmoTextAlign[]}
   */
  fillTextAlignments = []

  /**
   * Font sizes corresponding to {@linkcode GizmoBuffer#fillTexts}.
   *
   * @type {number[]}
   */
  fillTextSizes = []

  /**
   * Removes all submitted drawing data from the buffer.
   *
   * This sets the length of {@linkcode GizmoBuffer#positions},
   * {@linkcode GizmoBuffer#colors}, {@linkcode GizmoBuffer#polylinePositions},
   * {@linkcode GizmoBuffer#polylineColors}, {@linkcode GizmoBuffer#fillPositions},
   * {@linkcode GizmoBuffer#fillColors}, {@linkcode GizmoBuffer#texts},
   * {@linkcode GizmoBuffer#textAffines}, {@linkcode GizmoBuffer#textColors},
   * {@linkcode GizmoBuffer#textAlignments}, {@linkcode GizmoBuffer#fillTexts},
   * {@linkcode GizmoBuffer#fillTextAffines}, {@linkcode GizmoBuffer#fillTextColors}, and
   * {@linkcode GizmoBuffer#fillTextAlignments}, {@linkcode GizmoBuffer#textSizes}, and
   * {@linkcode GizmoBuffer#fillTextSizes} to `0`. The sixteen array
   * instances keep their identity and remain usable after the call.
   *
   * @returns {void}
   */
  clear() {
    this.positions.length = 0
    this.colors.length = 0
    this.polylinePositions.length = 0
    this.polylineColors.length = 0
    this.fillPositions.length = 0
    this.fillColors.length = 0
    this.texts.length = 0
    this.textAffines.length = 0
    this.textColors.length = 0
    this.textAlignments.length = 0
    this.textSizes.length = 0
    this.fillTexts.length = 0
    this.fillTextAffines.length = 0
    this.fillTextColors.length = 0
    this.fillTextAlignments.length = 0
    this.fillTextSizes.length = 0
  }
}

/* eslint-disable jsdoc/check-tag-names */
/**
 * Provides a labelled world resource for immediate-mode two-dimensional debug
 * drawing.
 *
 * The generic `label` is part of the resource's type ID, so use the same
 * constructor when retrieving it; different labels produce separate gizmo
 * resources. The constructor is exposed as {@linkcode Gizmo2D#type} for code
 * that needs to inspect the label.
 *
 * The resource keeps its current drawing transform, collects transformed line
 * and polyline vertices in {@linkcode Gizmo2D#buffer}, and uses
 * {@linkcode Gizmo2D#settings} for line width, cap, join, and dash behavior. Use
 * {@linkcode Gizmo2D#reset}, {@linkcode Gizmo2D#setTransform}, and the transform
 * helpers to position subsequent shapes; use primitive helpers such as
 * {@linkcode Gizmo2D#line}, {@linkcode Gizmo2D#arc}, and {@linkcode Gizmo2D#grid} to
 * append geometry. Drawing clears the buffer only after a successful draw;
 * missing window or canvas resources leave the buffer intact.
 *
 * @template T
 *
 * @example
 * ```js
 * import { Color } from '@wimaengine/color'
 * import { Gizmo2D } from '@wimaengine/gizmo'
 * import { typeidGeneric } from '@wimaengine/type'
 *
 * class PhysicsDebug {}
 *
 * function drawPhysicsDebug(world) {
 *   const gizmo = world.getResourceByTypeId(
 *     typeidGeneric(Gizmo2D, [PhysicsDebug])
 *   )
 *
 *   gizmo.reset().translate(10, 10).circle(2, Color.RED)
 * }
 * ```
 *
 * @category resource
 */
export class Gizmo2D {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  type

  /**
   * @private
   * @type {Affine2}
   */
  transformation = new Affine2()

  /**
   * @type {GizmoBuffer<Vector2>}
   */
  buffer = new GizmoBuffer()

  /**
   * @type {GizmoSettings}
   */
  settings

  /**
   * @param {Constructor<T>} type
   * @param {GizmoSettings} settings
   */
  constructor(type, settings) {
    this.settings = settings
    this.type = type
  }

  /**
   * @returns {this}
   */
  reset() {
    Affine2.identity(this.transformation)

    return this
  }

  /**
   * @param {Affine2} matrix
   * @returns {this}
   */
  setTransform(matrix) {
    this.transformation.copy(matrix)

    return this
  }

  /**
   * @param {Affine2} matrix
   * @returns {this}
   */
  transform(matrix) {
    Affine2.multiply(this.transformation, matrix, this.transformation)

    return this
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  translate(x, y) {
    Affine2.translate(this.transformation, new Vector2(x, y), this.transformation)

    return this
  }

  /**
   * @param {number} angle
   * @returns {this}
   */
  rotate(angle) {
    Affine2.rotate(this.transformation, Rotary.fromAngle(angle), this.transformation)

    return this
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  scale(x, y) {
    Affine2.scale(this.transformation, new Vector2(x, y), this.transformation)

    return this
  }

  /**
   * @param {Vector2} translation
   * @param {Rotary} orientation
   * @param {Vector2} scale
   * @returns {this}
   */
  compose(translation, orientation, scale) {
    Affine2.compose(translation, orientation, scale, this.transformation)

    return this
  }

  /**
   * Draws stroked text at the current transform's origin.
   *
   * @param {string} value
   * @param {Color} color
   * @param {GizmoTextAlign} align
   * @param {number} size
   * @returns {this}
   */
  text(value, color = Color.WHITE, align = GizmoTextAlign.Left, size = 16) {
    this.buffer.texts.push(value)
    this.buffer.textAffines.push(Affine2.copy(this.transformation, new Affine2()))
    this.buffer.textColors.push(color)
    this.buffer.textAlignments.push(align)
    this.buffer.textSizes.push(size)

    return this
  }

  /**
   * @param {Vector2} start
   * @param {Vector2} end
   * @param {Color} color
   * @returns
   */
  line(
    start = Vector2.Zero.clone(),
    end = Vector2.X.clone(),
    color = Color.WHITE
  ) {
    this.lineGradient(start, end, color, color)

    return this
  }

  /**
   * @param {Vector2} start
   * @param {Vector2} end
   * @param {Color} colorStart
   * @param {Color} colorEnd
   * @returns {this}
   */
  lineGradient(start, end, colorStart, colorEnd) {
    this.buffer.positions.push(
      this.transformation.transform(start),
      this.transformation.transform(end)
    )
    this.buffer.colors.push(colorStart, colorEnd)

    return this
  }

  /**
   * Draws filled text at the current transform's origin.
   *
   * @param {string} value
   * @param {Color} color
   * @param {GizmoTextAlign} align
   * @param {number} size
   * @returns {this}
   */
  fillText(value, color = Color.WHITE, align = GizmoTextAlign.Left, size = 16) {
    this.buffer.fillTexts.push(value)
    this.buffer.fillTextAffines.push(Affine2.copy(this.transformation, new Affine2()))
    this.buffer.fillTextColors.push(color)
    this.buffer.fillTextAlignments.push(align)
    this.buffer.fillTextSizes.push(size)

    return this
  }

  /**
   * @param {Vector2[]} points
   * @param {Color} color
   * @returns {this}
   */
  polyline(points, color) {
    for (let i = 0; i < points.length; i++) {
      this.buffer.polylinePositions.push(this.transformation.transform(points[i]))
      this.buffer.polylineColors.push(color)
    }

    this.buffer.polylinePositions.push(new Vector2(NaN, NaN))
    this.buffer.polylineColors.push(new Color(NaN, NaN, NaN, NaN))

    return this
  }

  /**
   * @param {[Vector2,Color][]} points
   * @returns {this}
   */
  polylineGradient(points) {
    for (let i = 0; i < points.length; i++) {
      this.buffer.polylinePositions.push(this.transformation.transform(points[i][0]))
      this.buffer.polylineColors.push(points[i][1])
    }

    this.buffer.polylinePositions.push(new Vector2(NaN, NaN))
    this.buffer.polylineColors.push(new Color(NaN, NaN, NaN, NaN))

    return this
  }

  /**
   * @param {number} arcStart
   * @param {number} arcEnd
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  arc(arcStart, arcEnd, radiusX = 1, radiusY = 1, color = Color.WHITE.clone(), resolution = 32) {
    const spacing = (arcEnd - arcStart) / resolution
    const radii = new Vector2(radiusX, radiusY)
    const positions = []

    for (let i = 0; i <= resolution; i++) {
      const position = Vector2.fromAngle(arcStart + spacing * i).multiply(radii)

      positions.push(position)
    }

    this.polyline(positions, color)

    return this
  }

  /**
   * Draws a sector outline from the origin.
   *
   * @param {number} arcStart
   * @param {number} arcEnd
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  sector(arcStart, arcEnd, radiusX = 1, radiusY = 1, color = Color.WHITE.clone(), resolution = 32) {
    const spacing = (arcEnd - arcStart) / resolution
    const radii = new Vector2(radiusX, radiusY)
    const positions = [Vector2.Zero.clone()]

    for (let i = 0; i <= resolution; i++) {
      positions.push(Vector2.fromAngle(arcStart + spacing * i).multiply(radii))
    }

    positions.push(Vector2.Zero.clone())
    this.polyline(positions, color)

    return this
  }

  /**
   * Draws a filled sector from the origin.
   *
   * @param {number} arcStart
   * @param {number} arcEnd
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  fillSector(arcStart, arcEnd, radiusX = 1, radiusY = 1, color = Color.WHITE.clone(), resolution = 32) {
    const spacing = (arcEnd - arcStart) / resolution
    const radii = new Vector2(radiusX, radiusY)
    const boundary = []

    for (let i = 0; i <= resolution; i++) {
      boundary.push(Vector2.fromAngle(arcStart + spacing * i).multiply(radii))
    }

    return this.fillPolygon([Vector2.Zero.clone(), ...boundary], color)
  }

  /**
   * Draws a closed polygon outline.
   *
   * @param {Vector2[]} vertices
   * @param {Color} color
   * @returns {this}
   */
  polygon(vertices, color = Color.WHITE) {
    if (!vertices[0]) return this

    this.polyline([...vertices, vertices[0]], color)

    return this
  }

  /**
   * Draws a filled convex polygon.
   *
   * @param {Vector2[]} vertices
   * @param {Color} color
   * @returns {this}
   */
  fillPolygon(vertices, color = Color.WHITE) {
    if (vertices.length < 3) return this

    const positions = [vertices[0], vertices[1], vertices[2]]
    for (let i = 1; i < vertices.length - 2; i++) {
      positions.push(vertices[i + 1], vertices[0], vertices[i + 1], vertices[i + 2])
    }

    for (let i = 0; i < positions.length; i++) {
      this.buffer.fillPositions.push(this.transformation.transform(positions[i]))
      this.buffer.fillColors.push(color)
    }

    this.buffer.fillPositions.push(new Vector2(NaN, NaN))
    this.buffer.fillColors.push(new Color(NaN, NaN, NaN, NaN))

    return this
  }

  /**
   * Draws a capsule centered on the origin and aligned to the local Y axis.
   *
   * @param {number} radius
   * @param {number} halfLength
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  capsule(radius = 1, halfLength = 1, color = Color.WHITE, resolution = 16) {
    const positions = [
      new Vector2(radius, -halfLength),
      new Vector2(radius, halfLength),
    ]

    for (let i = 1; i <= resolution; i++) {
      const angle = Math.PI * i / resolution
      positions.push(Vector2.fromAngle(angle).multiplyScalar(radius).add(new Vector2(0, halfLength)))
    }

    positions.push(new Vector2(-radius, -halfLength))
    for (let i = 1; i <= resolution; i++) {
      const angle = Math.PI + Math.PI * i / resolution
      positions.push(Vector2.fromAngle(angle).multiplyScalar(radius).add(new Vector2(0, -halfLength)))
    }

    this.polyline(positions, color)

    return this
  }

  /**
   * Draws a filled capsule centered on the origin and aligned to the local Y axis.
   *
   * @param {number} radius
   * @param {number} halfLength
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  fillCapsule(radius = 1, halfLength = 1, color = Color.WHITE, resolution = 16) {
    const boundary = [
      new Vector2(radius, -halfLength),
      new Vector2(radius, halfLength),
    ]

    for (let i = 1; i <= resolution; i++) {
      const angle = Math.PI * i / resolution
      boundary.push(Vector2.fromAngle(angle).multiplyScalar(radius).add(new Vector2(0, halfLength)))
    }

    boundary.push(new Vector2(-radius, -halfLength))
    for (let i = 1; i < resolution; i++) {
      const angle = Math.PI + Math.PI * i / resolution
      boundary.push(Vector2.fromAngle(angle).multiplyScalar(radius).add(new Vector2(0, -halfLength)))
    }

    return this.fillPolygon([Vector2.Zero.clone(), ...boundary, boundary[0]], color)
  }

  /**
   * @param {number} base
   * @param {number} height
   * @param {number} [baseRatio=0]
   * @param {Color} color
   * @returns {this}
   */
  triangle(base = 1, height = 1, baseRatio = 0, color = Color.WHITE) {
    this.polyline(
      [
        new Vector2(-base / 2, -height / 2),
        new Vector2(base / 2, -height / 2),
        new Vector2(base / 2 * baseRatio, height / 2),
        new Vector2(-base / 2, -height / 2),
      ],
      color,
    )

    return this
  }

  /**
   * Draws a filled triangle.
   *
   * @param {number} base
   * @param {number} height
   * @param {number} [baseRatio=0]
   * @param {Color} color
   * @returns {this}
   */
  fillTriangle(base = 1, height = 1, baseRatio = 0, color = Color.WHITE) {
    return this.fillPolygon([
      new Vector2(-base / 2, -height / 2),
      new Vector2(base / 2, -height / 2),
      new Vector2(base / 2 * baseRatio, height / 2),
    ], color)
  }

  /**
   * @param {Vector2} direction
   * @param {number} length
   * @param {Color} color
   * @returns {this}
   */
  arrow(
    direction = Vector2.X.clone(),
    length = 1,
    color = Color.RED.clone()
  ) {
    const directionLength = direction.magnitude()
    if (directionLength === 0 || length === 0) return this

    const normalizedDirection = Vector2.normalize(direction)
    const tip = Vector2.multiplyScalar(normalizedDirection, length)
    const headLength = Math.abs(length) * 0.25
    const headWidth = headLength * 0.6
    const headBase = Vector2.multiplyScalar(
      normalizedDirection,
      length - Math.sign(length) * headLength,
    )
    const headOffset = new Vector2(
      -normalizedDirection.y * headWidth,
      normalizedDirection.x * headWidth,
    )

    this.polyline([
      Vector2.Zero.clone(),
      headBase,
      Vector2.add(headBase, headOffset),
      tip,
      Vector2.subtract(headBase, headOffset),
      headBase,
    ], color)

    return this
  }

  /**
   * @param {Vector2} cellCount
   * @param {Vector2} spacing
   * @param {Color} color
   * @param {BVector2} drawEdges
   * @returns {this}
   */
  grid(
    cellCount = new Vector2(20, 20),
    spacing = new Vector2(1, 1),
    color = Color.WHITE,
    drawEdges = new BVector2()
  ) {
    const dimensions = Vector2.multiply(spacing, cellCount).multiplyScalar(0.5)
    const offset = new Vector2().set(
      drawEdges.x ? 0 : spacing.x,
      drawEdges.y ? 0 : spacing.y
    )

    for (let x = offset.x - dimensions.x; x <= dimensions.x - offset.x; x += spacing.x) {
      this.line(
        new Vector2(x, -dimensions.y),
        new Vector2(x, dimensions.y),
        color
      )
    }

    for (let y = offset.y - dimensions.y; y <= dimensions.y - offset.y; y += spacing.y) {
      this.line(
        new Vector2(-dimensions.x, y),
        new Vector2(dimensions.x, y),
        color
      )
    }

    return this
  }

  /**
   * @param {number} length
   * @returns {this}
   */
  axes(length) {
    this
      .arrow(
        Vector2.X.clone(),
        length,
        Color.RED.clone()
      )
      .arrow(
        Vector2.Y.clone(),
        length,
        Color.GREEN.clone()
      )

    return this
  }

  /**
   * @param {number} radius
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  circle(radius, color, resolution = 32) {
    this.arc(0, TAU, radius, radius, color, resolution)

    return this
  }

  /**
   * Draws a filled circle.
   *
   * @param {number} radius
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  fillCircle(radius, color, resolution = 32) {
    this.fillEllipse(radius, radius, color, resolution)

    return this
  }

  /**
   * @param {number} halfWidth
   * @param {number} halfHeight
   * @param {Color} color
   * @returns {this}
   */
  rect(halfWidth, halfHeight, color) {
    this.polyline(
      [
        new Vector2(-halfWidth, -halfHeight),
        new Vector2(-halfWidth, halfHeight),
        new Vector2(halfWidth, halfHeight),
        new Vector2(halfWidth, -halfHeight),
        new Vector2(-halfWidth, -halfHeight)
      ],
      color
    )

    return this
  }

  /**
   * Draws a filled rectangle centered on the origin.
   *
   * @param {number} halfWidth
   * @param {number} halfHeight
   * @param {Color} color
   * @returns {this}
   */
  fillRect(halfWidth, halfHeight, color) {
    return this.fillPolygon([
      new Vector2(-halfWidth, -halfHeight),
      new Vector2(-halfWidth, halfHeight),
      new Vector2(halfWidth, halfHeight),
      new Vector2(halfWidth, -halfHeight),
    ], color)
  }

  /**
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  ellipse(radiusX, radiusY, color, resolution = 32) {
    this.arc(0, TAU, radiusX, radiusY, color, resolution)

    return this
  }

  /**
   * Draws a filled ellipse.
   *
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  fillEllipse(radiusX, radiusY, color, resolution = 32) {
    const spacing = TAU / resolution
    const radii = new Vector2(radiusX, radiusY)
    const boundary = []

    for (let i = 0; i < resolution; i++) {
      boundary.push(Vector2.fromAngle(spacing * i).multiply(radii))
    }

    return this.fillPolygon([Vector2.Zero.clone(), ...boundary, boundary[0]], color)
  }
}

/**
 * Provides a labelled world resource for immediate-mode three-dimensional
 * debug drawing.
 *
 * The generic `label` is part of the resource's type ID, so use the same
 * constructor when retrieving it; different labels produce separate gizmo
 * resources. The constructor is exposed as {@linkcode Gizmo3D#type} for code
 * that needs to inspect the label.
 *
 * The resource owns a three-dimensional affine transform, collects vector
 * positions and colors in {@linkcode Gizmo3D#buffer}, and exposes
 * {@linkcode Gizmo3D#settings} for line settings. Use {@linkcode Gizmo3D#reset} to
 * restore the transform to identity. Unlike {@linkcode Gizmo2D}, this class
 * currently has no 3D primitive helpers; a 3D-capable integration can consume
 * or append the public buffer. The current canvas-2D drawing path cannot render
 * 3D geometry and clears this buffer every time it runs.
 *
 * @template T
 *
 * @example
 * ```js
 * import { Gizmo3D } from '@wimaengine/gizmo'
 * import { typeidGeneric } from '@wimaengine/type'
 *
 * class PhysicsDebug {}
 *
 * function preparePhysicsDebug(world) {
 *   const gizmo = world.getResourceByTypeId(
 *     typeidGeneric(Gizmo3D, [PhysicsDebug])
 *   )
 *
 *   gizmo.reset()
 *   // A 3D-capable integration can read or append gizmo.buffer here.
 * }
 * ```
 *
 * @category resource
 */
export class Gizmo3D {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  type

  /**
   * @private
   * @type {Affine3}
   */
  transformation = new Affine3()

  /**
   * @type {GizmoBuffer<Vector3>}
   */
  buffer = new GizmoBuffer()

  /**
   * @type {GizmoSettings}
   */
  settings

  /**
   * @param {Constructor<T>} type
   * @param {GizmoSettings} settings
   */
  constructor(type, settings) {
    this.type = type
    this.settings = settings
  }

  /**
   * Resets the drawing transform to the affine identity.
   *
   * The current {@linkcode Gizmo3D#buffer} contents and
   * {@linkcode Gizmo3D#settings} are preserved. This method mutates the transform
   * and returns `undefined`.
   *
   * @returns {void}
   */
  reset() {
    Affine3.identity(this.transformation)
  }
}
