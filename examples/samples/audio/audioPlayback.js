import {
  World,
  Audio,
  AudioPlayer,
  TimerMode,
  EntityCommands,
  Timer,
  Query,
  VirtualClock,
  AssetServer,
  DefaultPlugin,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  Plugin
} from 'wima'
import { HackPlugin, setupViewport } from '../utils.js'

class AudioTimer extends Timer {}

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
  .registerSystem(AppSchedule.Update, update)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const server = world.getResource(AssetServer)
  const commands = new EntityCommands(world)

  world.setResource(new AudioTimer({
    mode: TimerMode.Repeat,
    duration: 5
  }))
  commands
    .spawn()
    .insertPrefab([
      new AudioPlayer({
        audio: server.load(Audio, '/audio/bad-apple.m4a')
      }),
      new Timer({
        mode: TimerMode.Once,
        duration: 0
      })])
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const audios = new Query(world, [AudioPlayer, Timer])
  const clock = world.getResource(VirtualClock)
  const timer = world.getResource(AudioTimer)

  audios.each(([_player, playback]) => {
    if (timer.cycleStarted()) {
      const count = timer.cyclesCompleted()

      if (count === 1) {
        playback.pause()
      } else if (count === 2) {
        playback.play()
      } else if (count === 3) {
        playback.start()
      } else if (count === 4) {
        playback.stop()
      } else if (count === 5) {
        playback.speed = 1.2
        playback.play()
      } else if (count === 6) {
        playback.speed = 1.5
        playback.play()
      } else if (count === 7) {
        playback.speed = 1
        playback.seek(200)
      } else if (count === 8) {
        timer.reset()
      }
    }
  })

  timer.update(clock.getDelta())
}
