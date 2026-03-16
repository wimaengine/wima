import {
  World,
  Color,
  Vector2,
  GizmoLineStyle,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  Gizmo2D,
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
  .registerSystem(AppSchedule.Update, update)
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
function update(world) {
  const gizmo = world.getResource(DemoGizmo2D)

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
