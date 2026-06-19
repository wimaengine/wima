import { EntityCommands } from '../../core/index.js'
import { Range } from '../../datastructures/index.js'
import { Entity } from '../../ecs/index.js'

export class Emitter {

  // TODO: replace with handle to a scene
  /**
   * @type {(()=>unknown[]) | undefined}
   */
  prefab

  /**
   * @type {((commands:EntityCommands,entity:Entity)=>void) | undefined}
   */
  patch

  /**
   * @type {Range}
   */
  burstCount

  /**
   * @type {boolean}
   */
  enabled

  /**
   * @type {Range}
   */
  lifetime

  /**
   * @param {EmitterOptions} options
   */
  constructor({
    prefab,
    patch,
    lifetime = new Range(),
    burstCount = new Range(1, 1),
    enabled = true
  } = {}) {
    this.prefab = prefab
    this.patch = patch
    this.lifetime = lifetime
    this.burstCount = burstCount
    this.enabled = enabled
  }

  /**
   * @param {Emitter} source
   * @param {Emitter} target
   */
  static copy(source, target = new Emitter()) {
    target.prefab = source.prefab
    target.patch = source.patch
    target.lifetime = new Range(source.lifetime.start, source.lifetime.end)
    target.burstCount = new Range(source.burstCount.start, source.burstCount.end)
    target.enabled = source.enabled

    return target
  }

  /**
   * @param {Emitter} target
   */
  static clone(target) {
    return Emitter.copy(target)
  }

  /**
   * @param {Emitter} value
   */
  static serialize(value) {
    return {
      prefab: value.prefab,
      patch: value.patch,
      burstCount: Range.serialize(value.burstCount),
      enabled: value.enabled,
      lifetime: Range.serialize(value.lifetime)
    }
  }

  /**
   * @param {EmitterSerial} value
   * @param {Emitter} [out]
   */
  static deserialize(value, out = new Emitter()) {
    out.prefab = value.prefab
    out.patch = value.patch
    out.lifetime = Range.deserialize(value.lifetime, out.lifetime)
    out.burstCount = Range.deserialize(value.burstCount, out.burstCount)
    out.enabled = value.enabled

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is EmitterSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('prefab' in value) || !('patch' in value) || !('burstCount' in value) || !('enabled' in value) || !('lifetime' in value)) {
      return false
    }

    return (value.prefab === undefined || typeof value.prefab === 'function') &&
      (value.patch === undefined || typeof value.patch === 'function') &&
      typeof value.burstCount === 'object' &&
      Range.validSerial(value.burstCount) &&
      typeof value.enabled === 'boolean' &&
      typeof value.lifetime === 'object' &&
      Range.validSerial(value.lifetime)
  }
}

/**
 * @typedef EmitterSerial
 * @property {(() => unknown[]) | undefined} [prefab]
 * @property {((commands:EntityCommands,entity:Entity)=>void) | undefined} [patch]
 * @property {{ start: number, end: number }} burstCount
 * @property {boolean} enabled
 * @property {{ start: number, end: number }} lifetime
 */

/**
 * @typedef EmitterOptions
 * @property {()=>unknown[]} [prefab]
 * @property {(commands:EntityCommands,entity:Entity)=>void} [patch]
 * @property {Range} [burstCount]
 * @property {Range} [lifetime]
 * @property {boolean} [enabled]
 */
