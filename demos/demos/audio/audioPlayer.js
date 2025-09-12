import {
  Demo,
  World,
  AudioAssets,
  AudioPlayer,
  TimerMode,
  EntityCommands,
  Cleanup
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
  const audioSources = world.getResource(AudioAssets)
  const commands = world.getResource(EntityCommands)

  commands
    .spawn()
    .insertPrefab([
      new AudioPlayer({
        audio: audioSources.load('assets/audio/bad-apple.m4a'),
        playbackMode: TimerMode.Repeat
      }),
      new Cleanup()])
    .build()
}