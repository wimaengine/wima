import {
  Demo,
  World,
  AssetServer,
  AudioPlayer,
  TimerMode,
  EntityCommands,
  Cleanup,
  Audio,
  Timer
} from 'wima'
import { addDefaultCamera3D } from '../utils.js'

export default new Demo(
  'audio/audio player',
  [init, addDefaultCamera3D]
)

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
        audio: server.load(Audio, 'assets/audio/bad-apple.m4a')
      }),
      new Timer({
        mode: TimerMode.Repeat
      }),
      new Cleanup()
    ])
    .build()
}
