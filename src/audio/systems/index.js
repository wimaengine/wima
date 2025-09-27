import { Query, World } from '../../ecs/index.js'
import { Timer, TimerMode } from '../../time/index.js'
import { AudioAssets, AudioGraph } from '../resources/index.js'
import { AudioPlayer, AudioOscillator, AudioOscillatorType } from '../components/index.js'


/**
 * @param {World} world
 */
export function playAudio(world) {
  const graph = world.getResource(AudioGraph)
  const audioSources = world.getResource(AudioAssets)
  const players = new Query(world, [AudioPlayer, Timer])
  const ctx = graph.getContext()
  const root = graph.getRoot()

  players.each(([player, playback]) => {
    const { audio, sourceNode, attach } = player

    if (!audio) return

    const source = audioSources.get(audio)

    if (!source) {
      return
    }
    if (sourceNode) {
      if (playback.completed()) {
        graph.update(sourceNode, undefined)
      }

      if (!playback.playbackChanged()) return
      if (playback.paused) {
        graph.update(sourceNode, undefined)

        return
      }

      const node = new AudioBufferSourceNode(ctx, {
        buffer: source.audiobuffer,
        loop: looped(playback.mode),
        playbackRate: playback.speed
      })

      node.start(0, playback.elapsed())
      graph.update(sourceNode, node)

    } else {

      // The Oscillator will play in the next frame..
      // TODO: Maybe do this in a component hook?
      const id = graph.add(undefined)

      if (attach) {
        graph.connect(id, attach)
      } else {
        graph.connect(id, root)
      }

      const elapsed = playback.elapsed()

      playback.duration = source.audiobuffer.duration
      playback.reset()
      playback.seek(elapsed)
      player.sourceNode = id
    }
  })
}

/**
 * @param {World} world
 */
export function playOscillators(world) {
  const graph = world.getResource(AudioGraph)
  const oscillators = new Query(world, [AudioOscillator, Timer])
  const ctx = graph.getContext()
  const root = graph.getRoot()

  oscillators.each(([oscillator, playback]) => {
    const { type, frequency, sourceNode, detune, attach } = oscillator

    if (sourceNode) {
      if (playback.completed()) {
        graph.update(sourceNode, undefined)
      }
      if (!playback.playbackChanged()) return
      if (playback.paused) {
        graph.update(sourceNode, undefined)

        return
      }

      const node = new OscillatorNode(ctx, {
        detune,
        frequency,
        type: mapType(type)
      })

      node.start(0)
      graph.update(sourceNode, node)

    } else {

      // SAFETY: Since we dont know when the actual audio source will load, we set this node's weight to undefined.
      // TODO: Maybe do this in a component hook?
      const id = graph.add(undefined)

      if (attach) {
        graph.connect(id, attach)
      } else {
        graph.connect(id, root)
      }

      const elapsed = playback.elapsed()

      playback.reset()
      playback.seek(elapsed)
      oscillator.sourceNode = id
    }
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