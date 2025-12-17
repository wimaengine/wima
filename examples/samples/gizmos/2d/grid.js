import {
  World,
  Color,
  Vector2,
  BVector2,
  GizmoLineStyle,
  AppSchedule,
  App,
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
app.getWorld().setResourceAlias(typeidGeneric(Gizmo2D,[Demo]), DemoGizmo2D)

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
  .registerSystem(AppSchedule.Update, drawGrid)
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
function drawGrid(world) {
  const gizmo = world.getResource(DemoGizmo2D)

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