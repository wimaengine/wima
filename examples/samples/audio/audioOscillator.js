import {
  Demo,
  World,
  AudioOscillator,
  EntityCommands,
  Cleanup,
  Timer,
  TimerMode,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger
} from 'wima'
import { HackPlugin, setupViewport } from '../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem(AppSchedule.Startup, init)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  
  commands
    .spawn()
    .insertPrefab([
      new AudioOscillator(),
      new Timer({
        mode: TimerMode.Repeat
      }),
      new Cleanup()
    ])
    .build()
}