import {
  App,
  AppSchedule,
  World,
  FPSDebugger,
  DefaultTweenPlugin,
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
  materials
} from './demos/index.js'
import { ResourceAliasPlugin } from './demos/utils.js'

const app = new App()

app
  .registerPlugin(new ResourceAliasPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new DefaultTweenPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerDebugger(new FPSDebugger())
  .registerPlugin(new DemoPlugin({
    demos: [
      spawn,
      despawn,
      materials,
      easing,
      keyboard,
      mouse,
      touch
    ]
  }))
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