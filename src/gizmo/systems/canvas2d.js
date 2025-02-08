import {
  GizmoLineJoin,
  GizmoLineCap
} from '../core/index.js'


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
