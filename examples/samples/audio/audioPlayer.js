import {
  World,
  AssetServer,
  AudioPlayer,
  TimerMode,
  EntityCommands,
  Cleanup,
  Audio,
  Timer,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  Plugin
} from 'wima'
import { HackPlugin, setupViewport } from '../utils.js'

// Why use a plugin? The current implentation does not have system sets and
// systems registered directly on the App are precede ones registered by plugins.
// This conflict is between internal engine system and external engine systems ordering.
class MyPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem(AppSchedule.Startup, init)
  }
}

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerPlugin(new MyPlugin())
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const server = world.getResource(AssetServer)
  const commands = world.getResource(EntityCommands)

  commands
    .spawn()
    .insertPrefab([
      new AudioPlayer({
        audio: server.load(Audio, '/audio/bad-apple.m4a')
      }),
      new Timer({
        mode: TimerMode.Repeat
      }),
      new Cleanup()
    ])
    .build()
}
