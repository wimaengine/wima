/** @import {Entity} from 'chaosstudio' */
import {
  World,
  Color,
  Demo,
  Gizmo2D,
  Vector2,
  GizmoLineStyle
} from 'chaosstudio'

export const shapes = new Demo('gizmo2d/shapes', [init], [update])

function init(world) {
  const gizmo = world.getResource("gizmo2d<demo>")
  gizmo.settings.lineWidth = 2
  gizmo.settings.lineStyle = GizmoLineStyle.Solid
}

/**
 * @param {World} world
 */
function update(world) {
  const gizmo = world.getResource("gizmo2d<demo>")
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