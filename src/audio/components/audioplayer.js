/** @import { NodeId } from '../../datastructures/index.js' */
/** @import { ComponentHook } from '../../ecs/index.js' */
import { Handle } from '../../asset/index.js'
import { Timer, TimerMode } from '../../time/index.js'
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
  constructor({ attach, audio, playbackMode = TimerMode.Once } = {}) {
    this.attach = attach
    this.audio = audio
  }
}

/**
 * @type {ComponentHook}
 */
export function removeAudioPlayerSink(entity, world) {
  const graph = world.getResource(AudioGraph)
  const audio = world.get(entity, AudioPlayer)

  if(!audio){
    return
  }
  
  audio.audio?.drop()

  // SAFETY: The node referenced by the player is guaranteed to be a `AudioBufferSourceNode`.
  const node = /** @type {AudioBufferSourceNode | undefined} */(graph.graph.getNode(audio.sourceNode)?.weight)
  
  if(node){
    node.stop()

    // TODO: Remove the audio sink from the graph when removing nodes on a graph
    // is available.
  }
}

/**
 * @typedef AudioPlayerOptions
 * @property {NodeId} [attach]
 * @property {Handle<Audio>} [audio]
 * @property {TimerMode} [playbackMode]
 */