import {
  Demo,
  World,
  Audio,
  AudioPlayer,
  TimerMode,
  EntityCommands,
  Cleanup,
  Timer,
  Query,
  VirtualClock,
  AssetServer
} from 'wima'
import { addDefaultCamera3D } from '../utils.js'

export default new Demo(
  'audio/audio playback',
  [init, addDefaultCamera3D],
  [update]
)

/**
 * @param {World} world
 */
function init(world) {
  const server = world.getResource(AssetServer)
  const commands = world.getResource(EntityCommands)
  
  world.setResource(new AudioTimer({
    mode: TimerMode.Repeat,
    duration: 5
  }))
  commands
    .spawn()
    .insertPrefab([
      new AudioPlayer({
        audio: server.load(Audio, 'assets/audio/bad-apple.m4a')
      }),
      new Timer({
        mode: TimerMode.Once,
        duration: 0
      }),
      new Cleanup()
    ])
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const audios = new Query(world, [AudioPlayer, Timer])
  const clock = world.getResource(VirtualClock)
  const timer = world.getResource(AudioTimer)
  audios.each(([player, playback]) => {
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
      } else if(count === 8) {
        timer.reset()
      }
    }
  })
  
  timer.update(clock.getDelta())
}

class AudioTimer extends Timer {}