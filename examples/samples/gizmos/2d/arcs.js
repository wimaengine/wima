import {
  World,
  Color,
  GizmoLineStyle,
  PI,
  HALF_PI,
  QUARTER_PI,
  Gizmo2D,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  Gizmo2DPlugin,
  typeidGeneric
} from 'wima'
import { HackPlugin, addDefaultCamera2D, setupViewport } from '../../utils.js'

class Demo { }

/**
 * @augments {Gizmo2D<Demo>}
 */
class DemoGizmo2D extends Gizmo2D { }

const app = new App()

// We have to alias the gizmo resource manually
app.getWorld().setResourceAlias(typeidGeneric(Gizmo2D, [Demo]), DemoGizmo2D)

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerPlugin(new Gizmo2DPlugin({
    label: Demo
  }))
  .registerSystem(AppSchedule.Startup, init)
  .registerSystem(AppSchedule.Startup, addDefaultCamera2D)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerSystem(AppSchedule.Update, drawCirclularArcs)
  .registerSystem(AppSchedule.Update, drawEllipticalArcs)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const gizmo = world.getResource(DemoGizmo2D)

  gizmo.settings.lineWidth = 2
  gizmo.settings.lineStyle = GizmoLineStyle.Solid
}

/**
 * @param {World} world
 */
function drawCirclularArcs(world) {
  const gizmo = world.getResource(DemoGizmo2D)
  const radius = 40

  gizmo
    .translate(100, 100)
    .arc(0, QUARTER_PI, radius, radius, new Color(0.5, 0.5, 0.5, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, HALF_PI, radius, radius, new Color(1, 0, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, HALF_PI + QUARTER_PI, radius, radius, new Color(1, 1, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI, radius, radius, new Color(0, 1, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI + QUARTER_PI, radius, radius, new Color(0, 1, 1, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI + HALF_PI, radius, radius, new Color(0, 0, 1, 1))
    .axes(20)
    .reset()
    .translate(100, 200)
    .arc(0, PI + HALF_PI + QUARTER_PI, radius, radius, new Color(1, 0, 1, 1))
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
  const gizmo = world.getResource(DemoGizmo2D)
  const radiusX = 40
  const radiusY = 20

  gizmo
    .translate(100, 300)
    .arc(0, QUARTER_PI, radiusX, radiusY, new Color(0.5, 0.5, 0.5, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, HALF_PI, radiusX, radiusY, new Color(1, 0, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, HALF_PI + QUARTER_PI, radiusX, radiusY, new Color(1, 1, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI, radiusX, radiusY, new Color(0, 1, 0, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI + QUARTER_PI, radiusX, radiusY, new Color(0, 1, 1, 1))
    .axes(20)
    .translate(100, 0)
    .arc(0, PI + HALF_PI, radiusX, radiusY, new Color(0, 0, 1, 1))
    .axes(20)
    .reset()
    .translate(100, 400)
    .arc(0, PI + HALF_PI + QUARTER_PI, radiusX, radiusY, new Color(1, 0, 1, 1))
    .axes(20)
    .translate(100, 0)
    .ellipse(radiusX, radiusY, new Color(1, 1, 1, 1))
    .axes(20)
    .reset()
}
