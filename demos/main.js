/** @import {Entity} from 'chaos-studio' */
import {
  App,
  AppSchedule,
  World,
  FPSDebugger,
  AudioPlugin,
  CommandsPlugin,
  DefaultTweenPlugin,
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
  createCamera2D
} from 'chaosstudio'
import spawn from './demos/spawn.js'
import despawn from './demos/despawn.js'
import easing from './demos/easing.js'
import materials from './demos/material.js'
import keyboard from './demos/keyboard.js'
import mouse from './demos/mouse.js'
import touch from './demos/touch.js'

const app = new App()

app
  .registerPlugin(new CommandsPlugin())
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
function setupCamera(world) {
  world.create(createCamera2D())
}

/**
 * @param {World} world
 */
function setupViewport(world) {
  const windowcommands = world.getResource('windowcommands')
  const window = /** @type {Query<[Entity,MainWindow]>} */(new Query(world, ['entity', 'mainwindow'])).single()

  if (!window) return warn('No main window defined.')

  windowcommands
    .window(window[0])
    .resize(innerWidth, innerHeight)
}

addEventListener('contextmenu', (e) => e.preventDefault())