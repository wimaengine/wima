/** @import {Entity} from 'wima' */
import {
  World,
  Color,
  Demo,
  Vector2,
  GizmoLineStyle
} from 'wima'
import { Demo1Gizmo2D } from '../utils.js'

export default new Demo('gizmo2d/shapes', [init], [update])

/**
 * @param {World} world
 */
function init(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)

  gizmo.settings.lineWidth = 2
  gizmo.settings.lineStyle = GizmoLineStyle.Solid
}

/**
 * @param {World} world
 */
function update(world) {
  const gizmo = world.getResource(Demo1Gizmo2D)

  gizmo
    .translate(100, 150)
    .aabb(50, 50, new Color(1, 1, 1, 1))
    .axes(20)
    .translate(150, 0)
    .ellipse(60, 40, new Color(1, 1, 1, 1))
    .axes(20)
    .translate(150, 0)
    .circle(50, new Color(1, 1, 1, 1))
    .axes(20)
    .reset()
    .translate(100, 300)
    .grid(new Vector2(10, 10), new Vector2(10, 10))
    .axes(20)
    .translate(150, 0)
    .line(new Vector2(-50, 0), new Vector2(50, 0))
    .axes(20)
    .reset()
}