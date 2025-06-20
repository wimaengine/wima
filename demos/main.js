import {
  App,
  AppSchedule,
  World,
  FPSDebugger,
  AudioPlugin,
  CommandsPlugin,
  DefaultTweenPlugin,
  Gizmo2DPlugin,
  Gizmo3DPlugin,
  DOMWindowPlugin,
  InputPlugin,
  StoragePlugin,
  TimePlugin,
  TransformPlugin,
  WindowPlugin,
  RenderCorePlugin,
  Canvas2DRendererPlugin,
  DemoPlugin,
  MainWindow,
  Query,
  warn,
  createCamera2D,
  Entity,
  WindowCommands,
  DevicePlugin
} from 'wima'
import {
  spawn,
  despawn,
  keyboard,
  mouse,
  touch,
  easing,
  materials
} from './demos/index.js'

import {
  lineStyle,
  arcs2d,
  shapes,
  grid2d
} from './demos/gizmos/index.js'

const app = new App()

app
  .registerPlugin(new CommandsPlugin())
  .registerPlugin(new DevicePlugin())
  .registerPlugin(new AudioPlugin())
  .registerPlugin(new TimePlugin())
  .registerPlugin(new WindowPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new InputPlugin())
  .registerPlugin(new TransformPlugin())
  .registerPlugin(new RenderCorePlugin())
  .registerPlugin(new StoragePlugin())
  .registerSystem(AppSchedule.Startup, setupViewport)
  .registerSystem(AppSchedule.Startup, setupCamera)
  .registerPlugin(new DefaultTweenPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerPlugin(new Gizmo2DPlugin({
    name: "demo"
  }))
  .registerPlugin(new Gizmo2DPlugin({
    name: "demo2"
  }))
  .registerPlugin(new Gizmo3DPlugin({
    name: "demo"
  }))
  .registerPlugin(new Gizmo3DPlugin({
    name: "demo2"
  }))
  .registerDebugger(new FPSDebugger())
  .registerPlugin(new DemoPlugin({
    demos: [
      spawn,
      despawn,
      materials,
      easing,
      keyboard,
      mouse,
      touch,
      lineStyle,
      arcs2d,
      shapes,
      grid2d
    ]
  }))
  .run()

/**
 * @param {World} world
 */
function setupCamera(world) {
  world.create(createCamera2D())
}

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