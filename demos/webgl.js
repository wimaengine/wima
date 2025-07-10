import {
  App,
  AppSchedule,
  World,
  FPSDebugger,
  DemoPlugin,
  DOMWindowPlugin,
  WebglRendererPlugin,
  MainWindow,
  Query,
  warn,
  WindowCommands,
  Entity,
  DefaultPlugin,
  Windows
} from 'wima'
import {
  basictriangle,
  changecolortriangle,
  geometries,
  rotatingtriangle,
  movingtriangle,
  cameraRotate,
  orthograhicCamera,
  perspectiveCamera
} from './demos/index.js'
import { ResourceAliasPlugin } from './demos/utils.js'

const app = new App()

app
  .registerPlugin(new ResourceAliasPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new DemoPlugin({
    demos: [
      basictriangle,
      changecolortriangle,
      geometries,
      rotatingtriangle,
      movingtriangle,
      cameraRotate,
      orthograhicCamera,
      perspectiveCamera
    ]
  }))
  .registerDebugger(new FPSDebugger())
  .registerSystem(AppSchedule.Update, setupViewport)
  .run()


/**
 * @param {World} world
 */
function setupViewport(world) {
  const windowcommands = world.getResource(WindowCommands)
  const window = new Query(world, [Entity, MainWindow]).single()
  const canvases = world.getResource(Windows)
  const width = innerWidth
  const height = innerHeight

  if (!window) return warn('No main window defined.')

  const [entity] = window
  const canvas = canvases.getWindow(entity)

  if (!canvas) return

  const gl = canvas.getContext('webgl2')

  if (!gl) return

  gl.viewport(0, 0, width, height)
  windowcommands
    .window(entity)
    .resize(width, height)
}

addEventListener('contextmenu', (e) => e.preventDefault())