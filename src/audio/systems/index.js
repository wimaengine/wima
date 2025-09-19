import { Query, World } from '../../ecs/index.js'
import { VirtualClock, TimerMode } from '../../time/index.js'
import { AudioAssets, AudioGraph } from '../resources/index.js'
import { AudioPlayer, AudioOscillator, AudioOscillatorType } from '../components/index.js'


/**
 * @param {World} world
 */
export function playAudio(world) {
  const graph = world.getResource(AudioGraph)
  const audioSources = world.getResource(AudioAssets)
  const players = new Query(world, [AudioPlayer])
  const ctx = graph.getContext()
  const root = graph.getRoot()
  
  
  players.each(([player]) => {
    const { audio, sourceNode, playback, attach } = player

    if (!audio) return

    const source = audioSources.get(audio)

    if (!source) {
      return
    }
    if (sourceNode) {

      // update node if a play/pause or start/stop is requested
    } else {
      const node = new AudioBufferSourceNode(ctx, {
        buffer: source.audiobuffer,
        loop: looped(playback.mode)
      })
      const id = graph.add(node)

      if (attach) {
        graph.connect(id, attach)
      } else {
        graph.connect(id, root)
      }

      node.start(0, playback.elapsed())
      playback.duration = source.audiobuffer.duration
      player.sourceNode = id
    }
  })
}

/**
 * @param {World} world
 */
export function playOscillators(world) {
  const graph = world.getResource(AudioGraph)
  const oscillators = new Query(world, [AudioOscillator])
  const ctx = graph.getContext()
  const root = graph.getRoot()
  
  
  oscillators.each(([oscillator]) => {
    const { type, frequency, sourceNode, detune, playback, attach } = oscillator
    
    if (sourceNode) {
      
      // update node if a playback is requested
    } else {
      const node = new OscillatorNode(ctx, {
        detune,
        frequency,
        type: mapType(type)
      })
      const id = graph.add(node)
      
      if (attach) {
        graph.connect(id, attach)
      } else {
        graph.connect(id, root)
      }
      
      node.start(playback.elapsed())
      oscillator.sourceNode = id
    }
  })
}

/**
 * @param {World} world
 */
export function updateOscillators(world) {
  const oscillators = new Query(world, [AudioOscillator])
  const clock = world.getResource(VirtualClock)
  const delta = clock.getDelta()
  
  oscillators.each(([oscillator]) => {
    oscillator.playback.update(delta)
  })
}

/**
 * @param {TimerMode} playbackMode
 */
function looped(playbackMode) {
  switch (playbackMode) {
    case TimerMode.Once:
      return false

    case TimerMode.Repeat:
      return true

    default:
      return false
  }
}

/**
 * @param {AudioOscillatorType} type
 * @throws {string}
 * @returns {OscillatorType}
 */
function mapType(type) {
  switch (type) {
    case AudioOscillatorType.SawTooth:
      return 'sawtooth'

    case AudioOscillatorType.Sine:
      return 'sine'

    case AudioOscillatorType.Square:
      return 'square'

    case AudioOscillatorType.Triangle:
      return 'triangle'

    default:
      throw 'No such `AudioOscillatorType` exists.'
  }
}