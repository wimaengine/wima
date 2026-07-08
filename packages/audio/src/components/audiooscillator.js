/** @import { NodeId } from '@wimaengine/datastructures' */
/** @import { ComponentHook } from '@wimaengine/ecs' */
import { AudioGraph } from '../resources'

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
  static copy(source, target = new AudioOscillator()) {
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
    return AudioOscillator.copy(target)
  }

  /**
   * @param {AudioOscillator} value
   */
  static serialize(value) {
    return {
      sourceNode: value.sourceNode,
      attach: value.attach,
      type: value.type,
      detune: value.detune,
      frequency: value.frequency
    }
  }

  /**
   * @param {AudioOscillatorSerial} value
   * @param {AudioOscillator} [out]
   */
  static deserialize(value, out = new AudioOscillator()) {
    out.sourceNode = value.sourceNode
    out.attach = value.attach
    out.type = value.type
    out.detune = value.detune
    out.frequency = value.frequency

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is AudioOscillatorSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('sourceNode' in value) || !('attach' in value) || !('type' in value) || !('detune' in value) || !('frequency' in value)) {
      return false
    }

    return (value.sourceNode === undefined || typeof value.sourceNode === 'number') &&
      (value.attach === undefined || typeof value.attach === 'number') &&
      typeof value.type === 'number' &&
      typeof value.detune === 'number' &&
      typeof value.frequency === 'number'
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

/**
 * @typedef AudioOscillatorSerial
 * @property {NodeId | undefined} sourceNode
 * @property {NodeId | undefined} attach
 * @property {AudioOscillatorType} type
 * @property {number} detune
 * @property {number} frequency
 */
