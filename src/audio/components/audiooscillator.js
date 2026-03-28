/** @import { NodeId } from '../../datastructures/index.js' */
/** @import { ComponentHook } from '../../ecs/index.js' */
import { AudioGraph } from '../resources/index.js'

export class AudioOscillator {

  /**
   * @type {NodeId | undefined}
   */
  sourceNode

  /**
   * @type {AudioOscillatorType}
   */
  type

  /**
   * @type {NodeId | undefined}
   */
  attach

  /**
   * @type {number}
   */
  detune

  /**
   * @type {number}
   */
  frequency

  /**
   * @param {AudioOscillatorOptions} [options]
   */
  constructor({
    attach,
    type = AudioOscillatorType.Sine,
    detune = 0,
    frequency = 440
  } = {}) {
    this.attach = attach
    this.type = type
    this.detune = detune
    this.frequency = frequency
  }

  /**
   * @param {AudioOscillator} source
   * @param {AudioOscillator} target
   */
  static copy(source, target = new AudioOscillator()){
    target.sourceNode = source.sourceNode
    target.attach = source.attach
    target.type = source.type
    target.detune = source.detune
    target.frequency = source.frequency

    return target
  }

  /**
   * @param {AudioOscillator} target
   */
  static clone(target) {
    return this.copy(target)
  }
}

/**
 * @type {ComponentHook}
 */
export function removeOscillatorSink(entity, world) {
  const graph = world.getResource(AudioGraph)
  const audio = world.get(entity, AudioOscillator)

  // SAFETY: The node referenced by the player is guaranteed to be a `OscillatorNode`.
  const node = /** @type {OscillatorNode | undefined} */ (graph.graph.getNode(audio.sourceNode)?.weight)

  if (node) {
    node.stop()

    // TODO: Remove the audio sink from the graph when removing nodes on a graph
    // is available.
  }
}

/**
 * @readonly
 * @enum {number}
 */
export const AudioOscillatorType = {
  SawTooth: 0,
  Sine: 1,
  Triangle: 2,
  Square: 3
}

/**
 * @typedef AudioOscillatorOptions
 * @property {NodeId} [attach]
 * @property {AudioOscillatorType} [type]
 * @property {number} [frequency]
 * @property {number} [detune]
 */
