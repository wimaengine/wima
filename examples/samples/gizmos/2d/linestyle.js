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

class Demo1 { }
class Demo2 { }
/**
 * @augments {Gizmo2D<Demo1>}
 */
class Demo1Gizmo2D extends Gizmo2D { }
/**
 * @augments {Gizmo2D<Demo2>}
 */
class Demo2Gizmo2D extends Gizmo2D { }

const app = new App()

// We have to alias the gizmo resource manually
app.getWorld().setResourceAlias(typeidGeneric(Gizmo2D,[Demo1]), Demo1Gizmo2D)
app.getWorld().setResourceAlias(typeidGeneric(Gizmo2D,[Demo2]), Demo2Gizmo2D)

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerPlugin(new Gizmo2DPlugin({
    label: Demo1
  }))
  .registerPlugin(new Gizmo2DPlugin({
    label: Demo2
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
  const solidgizmo = world.getResource(Demo1Gizmo2D)
  const dashedgizmo = world.getResource(Demo2Gizmo2D)

  solidgizmo.settings.lineWidth = 5
  solidgizmo.settings.lineStyle = GizmoLineStyle.Solid
  dashedgizmo.settings.lineWidth = 5
  dashedgizmo.settings.lineStyle = GizmoLineStyle.Dashed

}

/**
 * @param {World} world
 */
function update(world) {
  const solidgizmo = world.getResource(Demo1Gizmo2D)
  const dashedgizmo = world.getResource(Demo2Gizmo2D)

  solidgizmo
    .line(new Vector2(100, 100), new Vector2(500, 100), new Color(0.5, 0.5, 0.5, 1))
    .line(new Vector2(100, 200), new Vector2(500, 200), new Color(1, 0, 0, 1))
    .line(new Vector2(100, 300), new Vector2(500, 300), new Color(1, 1, 0, 1))
    .line(new Vector2(100, 400), new Vector2(500, 400), new Color(0, 1, 0, 1))
    .line(new Vector2(100, 500), new Vector2(500, 500), new Color(0, 1, 1, 1))
    .line(new Vector2(100, 600), new Vector2(500, 600), new Color(0, 0, 1, 1))
    .line(new Vector2(100, 700), new Vector2(500, 700), new Color(1, 1, 1, 1))

  dashedgizmo
    .line(new Vector2(100, 150), new Vector2(500, 150), new Color(0.5, 0.5, 0.5, 1))
    .line(new Vector2(100, 250), new Vector2(500, 250), new Color(1, 0, 0, 1))
    .line(new Vector2(100, 350), new Vector2(500, 350), new Color(1, 1, 0, 1))
    .line(new Vector2(100, 450), new Vector2(500, 450), new Color(0, 1, 0, 1))
    .line(new Vector2(100, 550), new Vector2(500, 550), new Color(0, 1, 1, 1))
    .line(new Vector2(100, 650), new Vector2(500, 650), new Color(0, 0, 1, 1))
    .line(new Vector2(100, 750), new Vector2(500, 750), new Color(1, 1, 1, 1))
}
