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
    return this.copy(target)
  }
}

/**
 * @typedef EmitterOptions
 * @property {()=>unknown[]} [prefab]
 * @property {(commands:EntityCommands,entity:Entity)=>void} [patch]
 * @property {Range} [burstCount]
 * @property {Range} [lifetime]
 * @property {boolean} [enabled]
 */
