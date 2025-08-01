import {
  App,
  AppSchedule,
  World,
  FPSDebugger,
  Gizmo2DPlugin,
  Gizmo3DPlugin,
  DOMWindowPlugin,
  Canvas2DRendererPlugin,
  DemoPlugin,
  MainWindow,
  Query,
  warn,
  Entity,
  WindowCommands,
  DefaultPlugin
} from 'wima'
import {
  spawn,
  despawn,
  keyboard,
  mouse,
  touch,
  easing,
  materials,
  lineStyle2d,
  arcs2d,
  shapes2d,
  grid2d,
  translate2d,
  rotate2d,
  scale2d,
  propagate2d,
  lookat2d
} from './demos/index.js'
import { Demo1, Demo2, ResourceAliasPlugin } from './demos/utils.js'

const app = new App()

app
  .registerPlugin(new ResourceAliasPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerPlugin(new Gizmo2DPlugin({
    label: Demo1
  }))
  .registerPlugin(new Gizmo2DPlugin({
    label: Demo2
  }))
  .registerPlugin(new Gizmo3DPlugin({
    label: Demo1
  }))
  .registerPlugin(new Gizmo3DPlugin({
    label: Demo2
  }))
  .registerPlugin(new DemoPlugin({
    demos: [
      spawn,
      despawn,
      materials,
      easing,
      keyboard,
      mouse,
      touch,
      lineStyle2d,
      arcs2d,
      shapes2d,
      grid2d,
      shapes2d,
      grid2d,
      translate2d,
      rotate2d,
      scale2d,
      propagate2d,
      lookat2d
    ]
  }))
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function setupViewport(world) {
  const windowcommands = world.getResource(WindowCommands)
  const window = new Query(world, [Entity, MainWindow]).single()

  if (!window) return warn('No main window defined.')

  windowcommands
    .window(window[0])
    .resize(innerWidth, innerHeight)
}

addEventListener('contextmenu', (e) => e.preventDefault())