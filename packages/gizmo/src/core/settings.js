/**
 * Provides the line-pattern choices used by gizmo drawing configuration. Use
 * these numeric values for {@linkcode GizmoSettings#lineStyle}.
 *
 * @readonly
 * @enum {number}
 * @example
 * ```js
 * import { GizmoLineStyle, GizmoSettings } from '@wimaengine/gizmo'
 *
 * const settings = new GizmoSettings()
 * settings.lineStyle = GizmoLineStyle.Dashed
 * ```
 */
export const GizmoLineStyle = {

  /** Selects continuous line rendering (`0`). */
  Solid: 0,

  /** Selects dashed line rendering (`1`). */
  Dashed: 1
}

/**
 * Provides the line-end choices used by gizmo drawing configuration. Use these
 * numeric values for {@linkcode GizmoSettings#lineCap}.
 *
 * @readonly
 * @enum {number}
 * @example
 * ```js
 * import { GizmoLineCap, GizmoSettings } from '@wimaengine/gizmo'
 *
 * const settings = new GizmoSettings()
 * settings.lineCap = GizmoLineCap.Round
 * ```
 */
export const GizmoLineCap = {

  /** Selects a line end that stops at the endpoint (`0`). */
  Butt: 0,

  /** Selects a semicircular line end (`1`). */
  Round: 1,

  /** Selects a square line end that extends past the endpoint (`2`). */
  Square: 2
}

/**
 * Provides the corner choices used where connected gizmo lines meet. Use these
 * numeric values for {@linkcode GizmoSettings#lineJoin}.
 *
 * @readonly
 * @enum {number}
 * @example
 * ```js
 * import { GizmoLineJoin, GizmoSettings } from '@wimaengine/gizmo'
 *
 * const settings = new GizmoSettings()
 * settings.lineJoin = GizmoLineJoin.Round
 * ```
 */
export const GizmoLineJoin = {

  /** Selects a beveled line join (`0`). */
  Bevel: 0,

  /** Selects a sharp miter line join (`1`). */
  Mitre: 1,

  /** Selects a rounded line join (`2`). */
  Round: 2
}

/**
 * Provides the horizontal text-justification choices used by
 * {@linkcode Gizmo2D#text} and {@linkcode Gizmo2D#fillText}.
 *
 * @readonly
 * @enum {number}
 */
export const GizmoTextAlign = Object.freeze({

  /** Aligns text by its left edge (`0`). */
  Left: 0,

  /** Aligns text by its center (`1`). */
  Center: 1,

  /** Aligns text by its right edge (`2`). */
  Right: 2
})

/**
 * Mutable line-drawing configuration shared by a {@linkcode Gizmo2DPlugin} or
 * {@linkcode Gizmo3DPlugin} and the gizmo resource it installs.
 *
 * Pass an instance as a plugin's optional `settings` input to customize gizmo
 * line rendering. If the input is omitted, the plugin creates an instance
 * with its default values. The same settings object is stored on the resulting
 * {@linkcode Gizmo2D} or {@linkcode Gizmo3D} resource, so changing it changes
 * subsequent drawing.
 *
 * @example
 * ```js
 * import { Gizmo2DPlugin, GizmoLineCap, GizmoLineStyle, GizmoSettings } from '@wimaengine/gizmo'
 *
 * class DebugGizmo {}
 * const settings = new GizmoSettings()
 * settings.lineWidth = 2
 * settings.lineCap = GizmoLineCap.Round
 * settings.lineStyle = GizmoLineStyle.Dashed
 *
 * const plugin = new Gizmo2DPlugin({ label: DebugGizmo, settings })
 * ```
 */
export class GizmoSettings {

  /**
   * Line width applied to the canvas context. Defaults to `1`.
   *
   * @type {number}
   */
  lineWidth = 1

  /**
   * Line-end shape. Defaults to {@linkcode GizmoLineCap.Butt} (`0`).
   *
   * @type {GizmoLineCap}
   */
  lineCap = GizmoLineCap.Butt

  /**
   * Line-join shape. Defaults to {@linkcode GizmoLineJoin.Mitre} (`1`).
   *
   * @type {GizmoLineJoin}
   */
  lineJoin = GizmoLineJoin.Mitre

  /**
   * Line pattern. Defaults to {@linkcode GizmoLineStyle.Solid} (`0`).
   *
   * @type {GizmoLineStyle}
   */
  lineStyle = GizmoLineStyle.Solid

  /**
   * Offset applied to the dash pattern. Defaults to `0`.
   *
   * @type {number}
   */
  lineDashOffset = 0
}
