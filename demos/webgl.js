import {
  App,
  AppSchedule,
  World,
  FPSDebugger,
  AudioPlugin,
  CommandsPlugin,
  DefaultTweenPlugin,
  DemoPlugin,
  DOMWindowPlugin,
  InputPlugin,
  StoragePlugin,
  TimePlugin,
  TransformPlugin,
  WindowPlugin,
  RenderCorePlugin,
  WebglRendererPlugin,
  EulerIntegrator3DPlugin,
  DevicePlugin,
  MovablePlugin,
  MainWindow,
  Query,
  warn,
  createCamera2D,
  WindowCommands,
  Entity
} from 'wima'
import {
  basictriangle,
  colortriangle,
  changecolortriangle,
  geometries,
  rotatingtriangle,
  movingtriangle,
  cameraRotate,
  orthograhicCamera,
  perspectiveCamera
} from './demos/index.js'

const app = new App()

app
  .registerPlugin(new CommandsPlugin())
  .registerPlugin(new DevicePlugin())
  .registerPlugin(new AudioPlugin())
  .registerPlugin(new TimePlugin())
  .registerPlugin(new WindowPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new InputPlugin())
  .registerPlugin(new EulerIntegrator3DPlugin())
  .registerPlugin(new TransformPlugin())
  .registerPlugin(new MovablePlugin())
  .registerPlugin(new RenderCorePlugin())
  .registerPlugin(new StoragePlugin())
  .registerPlugin(new DefaultTweenPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerDebugger(new FPSDebugger())
  .registerPlugin(new DemoPlugin({
    demos: [
      basictriangle,
      colortriangle,
      changecolortriangle,
      geometries,
      rotatingtriangle,
      movingtriangle,
      cameraRotate,
      orthograhicCamera,
      perspectiveCamera
    ]
  }))
  .registerSystem(AppSchedule.Startup, setupViewport)
  .registerSystem(AppSchedule.Startup, setupCamera)
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
    .resize(300, 300)
}

addEventListener('contextmenu', (e) => e.preventDefault())