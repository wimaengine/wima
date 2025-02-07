/**
 * @readonly
 * @enum {number}
 */
export const GizmoLineStyle = {
  Solid: 0,
  Dashed: 1
}

/**
 * @readonly
 * @enum {number}
 */
export const GizmoLineCap = {
  Butt: 0,
  Round: 1,
  Square: 2
}

/**
 * @readonly
 * @enum {number}
 */
export const GizmoLineJoin = {
  Bevel: 0,
  Mitre: 1,
  Round: 2
}

export class GizmoSettings {

  /**
   * @type {number}
   */
  lineWidth = 1

  /**
   * @type {GizmoLineCap}
   */
  lineCap = GizmoLineCap.Butt

  /**
   * @type {GizmoLineJoin}
   */
  lineJoin = GizmoLineJoin.Mitre

  /**
   * @type {GizmoLineStyle}
   */
  lineStyle = GizmoLineStyle.Solid

  /**
   * @type {number}
   */
  lineDashOffset = 0
}