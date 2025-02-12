import {
  World,
  Color,
  Demo,
  Gizmo2D,
  Vector2,
  BVector2,
  GizmoLineStyle
} from 'chaosstudio'

export const grid2d = new Demo('gizmo2d/grid', [init], [drawGrid])

/**
 * @param {World} world
 */
function init(world) {
  const gizmo = world.getResource("gizmo2d<demo>")
  gizmo.settings.lineWidth = 2
  gizmo.settings.lineStyle = GizmoLineStyle.Solid
}

/**
 * @param {World} world
 */
function drawGrid(world) {
  const gizmo = world.getResource("gizmo2d<demo>")

  gizmo
    .translate(200, 200)
    .grid(
      new Vector2(10, 10),
      new Vector2(25, 25)
    )
    .translate(0, 300)
    .grid(
      new Vector2(10, 10),
      new Vector2(25, 25),
      Color.WHITE.clone(),
      new BVector2(true, true)
    )
    .reset()
}