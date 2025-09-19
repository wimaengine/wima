import {
  Demo,
  World,
  AudioOscillator,
  EntityCommands,
  Cleanup,
  Timer,
  TimerMode
} from 'wima'
import { addDefaultCamera3D } from '../utils.js'

export default new Demo(
  'audio/audio oscillator',
  [init, addDefaultCamera3D]
)

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