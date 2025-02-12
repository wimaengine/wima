import {
  World,
  Color,
  Demo,
  Gizmo2D,
  Vector2,
  GizmoLineStyle
} from 'chaosstudio'

const TWO_PI = Math.PI * 2
const PI = Math.PI
const HALF_PI = Math.PI / 2
const QUATER_PI = Math.PI / 4

export const arcs2d = new Demo('gizmo2d/arcs', [init], [drawCirclularArcs, drawEllipticalArcs])

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
function drawCirclularArcs(world) {
  const gizmo = world.getResource("gizmo2d<demo>")
  const radius = 40

  gizmo
    .translate(100, 100)
    .arc(0, QUATER_PI, radius, radius, new Color(0.5, 0.5, 0.5, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, HALF_PI, radius, radius, new Color(1, 0, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, HALF_PI + QUATER_PI, radius, radius, new Color(1, 1, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI, radius, radius, new Color(0, 1, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI + QUATER_PI, radius, radius, new Color(0, 1, 1, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI + HALF_PI, radius, radius, new Color(0, 0, 1, 1))
    .axes(20)
    .reset()
    .translate(100, 200)
    .arc(0, PI + HALF_PI + QUATER_PI, radius, radius, new Color(1, 0, 1, 1))
    .axes(20)
    .translate(100, 0)
    .circle(radius, new Color(1, 1, 1, 1))
    .axes(20)
    .reset()
}

/**
 * @param {World} world
 */
function drawEllipticalArcs(world) {
  const gizmo = world.getResource("gizmo2d<demo>")
  const radiusX = 40
  const radiusY = 20

  gizmo
    .translate(100, 300)
    .arc(0, QUATER_PI, radiusX, radiusY, new Color(0.5, 0.5, 0.5, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, HALF_PI, radiusX, radiusY, new Color(1, 0, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, HALF_PI + QUATER_PI, radiusX, radiusY, new Color(1, 1, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI, radiusX, radiusY, new Color(0, 1, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI + QUATER_PI, radiusX, radiusY, new Color(0, 1, 1, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI + HALF_PI, radiusX, radiusY, new Color(0, 0, 1, 1))
    .axes(20)
    .reset()
    .translate(100, 400)
    .arc(0, PI + HALF_PI + QUATER_PI, radiusX, radiusY, new Color(1, 0, 1, 1))
    .axes(20)
    .translate(100, 0)
    .ellipse(radiusX, radiusY, new Color(1, 1, 1, 1))
    .axes(20)
    .reset()
}