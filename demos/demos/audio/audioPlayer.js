import {
  Demo,
  World,
  AssetServer,
  AudioPlayer,
  TimerMode,
  EntityCommands,
  Cleanup,
  Audio
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
        audio: server.load(Audio,'assets/audio/bad-apple.m4a'),
        playbackMode: TimerMode.Repeat
      }),
      new Cleanup()])
    .build()
}