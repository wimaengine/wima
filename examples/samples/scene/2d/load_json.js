import {
  App,
  AppSchedule,
  AssetServer,
  Canvas2DRendererPlugin,
  createTransform2D,
  DefaultPlugin,
  DOMWindowPlugin,
  EntityCommands,
  FPSDebugger,
  Scene,
  SceneInstance,
  World
} from 'wima'
import { HackPlugin, setupViewport } from '../../utils.js'

const app = new App()

app
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const server = world.getResource(AssetServer)

  const sceneHandle = server.load(Scene, '/scene/basic.json')

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new SceneInstance(sceneHandle)
    ])
    .build()
}
