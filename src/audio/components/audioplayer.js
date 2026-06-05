/** @import { NodeId } from '../../datastructures/index.js' */
/** @import { ComponentHook } from '../../ecs/index.js' */
import { Handle, HandleSnapshot } from '../../asset/index.js'
import { Audio } from '../assets/index.js'
import { AudioGraph } from '../resources/index.js'

export class AudioPlayer {

  /**
   * @type {NodeId | undefined}
   */
  sourceNode

  /**
   * @type {NodeId | undefined}
   */
  attach

  /**
   * @type {Handle<Audio> | undefined}
   */
  audio

  /**
   * @param {AudioPlayerOptions} [options]
   */
  constructor({ attach, audio } = {}) {
    this.attach = attach
    this.audio = audio
  }

  /**
   * @param {AudioPlayer} source
   * @param {AudioPlayer} target
   */
  static copy(source, target = new AudioPlayer()) {
    target.sourceNode = source.sourceNode
    target.attach = source.attach
    target.audio = source.audio

    return target
  }

  /**
   * @param {AudioPlayer} target
   */
  static clone(target) {
    return AudioPlayer.copy(target)
  }

  /**
   * @param {import('../../ecs/index.js').World} world
   * @returns {AudioPlayerSnapshot}
   */
  toSnapshot(world) {
    return new AudioPlayerSnapshot(
      this.sourceNode,
      this.attach,
      this.audio?.toSnapshot(world)
    )
  }
}

/**
 * Snapshot of an audio player component.
 */
export class AudioPlayerSnapshot {

  /**
   * @type {NodeId | undefined}
   */
  sourceNode

  /**
   * @type {NodeId | undefined}
   */
  attach

  /**
   * @type {HandleSnapshot<Audio> | undefined}
   */
  audio

  /**
   * @param {NodeId | undefined} sourceNode
   * @param {NodeId | undefined} attach
   * @param {HandleSnapshot<Audio> | undefined} audio
   */
  constructor(sourceNode, attach, audio) {
    this.sourceNode = sourceNode
    this.attach = attach
    this.audio = audio
  }

  /**
   * @param {import('../../ecs/index.js').World} world
   * @returns {AudioPlayer}
   */
  fromSnapshot(world) {
    const player = new AudioPlayer({
      attach: this.attach,
      audio: this.audio?.fromSnapshot(world)
    })

    player.sourceNode = this.sourceNode

    return player
  }
}

/**
 * @type {ComponentHook}
 */
export function removeAudioPlayerSink(entity, world) {
  const graph = world.getResource(AudioGraph)
  const audio = world.get(entity, AudioPlayer)

  if (!audio) {
    return
  }

  audio.audio?.drop()

  // SAFETY: The node referenced by the player is guaranteed to be a `AudioBufferSourceNode`.
  const node = /** @type {AudioBufferSourceNode | undefined} */(graph.graph.getNode(audio.sourceNode)?.weight)

  if (node) {
    node.stop()

    // TODO: Remove the audio sink from the graph when removing nodes on a graph
    // is available.
  }
}

/**
 * @typedef AudioPlayerOptions
 * @property {NodeId} [attach]
 * @property {Handle<Audio>} [audio]
 */
