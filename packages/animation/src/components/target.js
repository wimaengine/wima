import { EntityHandle } from '@wimaengine/ecs'

export class AnimationTarget {

  /**
   * @type {EntityHandle}
   */
  player

  /**
   * @type {string}
   */
  id

  /**
   * @param {EntityHandle} player
   * @param {string} id
   */
  constructor(player, id) {
    this.player = player
    this.id = id
  }

  /**
   * @param {AnimationTarget} source
   * @param {AnimationTarget} target
   */
  static copy(source, target = new AnimationTarget(source.player, source.id)) {
    target.player = source.player
    target.id = source.id

    return target
  }

  /**
   * @param {AnimationTarget} target
   */
  static clone(target) {
    return AnimationTarget.copy(target)
  }

  /**
   * @param {AnimationTarget} value
   */
  static serialize(value) {
    return {
      player: EntityHandle.serialize(value.player),
      id: value.id
    }
  }

  /**
   * @param {AnimationTargetSerial} value
   * @param {AnimationTarget} [out]
   */
  static deserialize(value, out = new AnimationTarget(new EntityHandle(0, 0), '')) {
    out.player = EntityHandle.deserialize(value.player, out.player)
    out.id = value.id

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is AnimationTargetSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object') {
      return false
    }

    if (!('player' in value) || !('id' in value)) {
      return false
    }

    return !!value.player && typeof value.id === 'string'
  }
}

/**
 * Serialized form of `AnimationTarget`.
 *
 * @typedef AnimationTargetSerial
 * @property {any} player
 * @property {string} id
 */
