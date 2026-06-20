/** @import { PlaybackSettings } from '../core/index.js'*/
/** @import { AssetId } from '../../asset/index.js'*/
/** @import { ComponentHook } from '../../ecs/index.js' */
import { Handle } from '../../asset/index.js'
import { Playback } from '../core/index.js'
import { AnimationClip } from '../assets/index.js'

export class AnimationPlayer {

  /**
   * @type {Map<AssetId,Playback>}
   */
  animations = new Map()

  /**
   * @type {Map<AssetId,Handle<AnimationClip>>}
   */
  handles = new Map()

  /**
   * @type {number | null}
   */
  current = null

  /**
   * @param {AnimationPlayer} source
   * @param {AnimationPlayer} target
   */
  static copy(source, target = new AnimationPlayer()) {
    const { animations, handles } = target

    animations.clear()
    handles.clear()
    source.animations.forEach((playback, id) => {
      animations.set(id, Playback.copy(playback))
    })
    source.handles.forEach((handle, id) => {
      handles.set(id, handle.clone())
    })

    target.current = source.current

    return target
  }

  /**
   * @param {AnimationPlayer} target
   */
  static clone(target) {
    return AnimationPlayer.copy(target)
  }

  /**
   * @param {AnimationPlayer} value
   */
  static serialize(value) {
    return {
      animations: Array.from(value.animations.entries()).map(([id, playback]) => [
        id,
        Playback.serialize(playback)
      ]),
      current: value.current
    }
  }

  /**
   * @param {unknown} value
   * @returns {value is AnimationPlayerSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object') {
      return false
    }

    if (!('animations' in value) || !('current' in value)) {
      return false
    }

    if (!Array.isArray(value.animations)) {
      return false
    }

    if (value.current !== null && typeof value.current !== 'number') {
      return false
    }

    for (let i = 0; i < value.animations.length; i++) {
      const entry = value.animations[i]

      if (!Array.isArray(entry) || entry.length !== 2) {
        return false
      }

      const [id, playback] = entry

      if (typeof id !== 'number' || !Playback.validateSerial(playback)) {
        return false
      }
    }

    return true
  }

  /**
   * @param {AnimationPlayerSerial} value
   * @param {AnimationPlayer} [out]
   */
  static deserialize(value, out = new AnimationPlayer()) {
    out.animations = new Map(
      value.animations.map(([id, playback]) => [id, Playback.deserialize(playback)])
    )
    out.current = value.current

    return out
  }

  /**
   * @param {Handle<AnimationClip>} handle
   * @param {PlaybackSettings} settings
   */
  set(handle, settings) {
    const playback = new Playback(settings)
    const id = handle.id()
    const existing = this.handles.get(id)

    if (existing && existing !== handle) {
      existing.drop()
    }

    this.animations.set(id, playback)
    this.handles.set(id, handle)

    return this
  }

  /**
   * @param {Handle<AnimationClip>} handle
   */
  get(handle) {
    return this.animations.get(handle.id())
  }

  /**
   * @param {Handle<AnimationClip>} handle
   */
  delete(handle) {
    const id = handle.id()
    const existing = this.handles.get(id)

    this.animations.delete(id)
    this.handles.delete(id)
    existing?.drop()

    return this
  }

  /**
   * @param {Handle<AnimationClip>} handle
   */
  start(handle) {
    const playback = this.get(handle)

    if (playback) {
      playback.start()
    }

    return this
  }

  /**
   * @param {Handle<AnimationClip>} handle
   */
  stop(handle) {
    const playback = this.get(handle)

    if (playback) {
      playback.stop()
    }

    return this
  }

  /**
   * @param {Handle<AnimationClip>} handle
   */
  play(handle) {
    const playback = this.get(handle)

    if (playback) {
      playback.play()
    }

    return this
  }

  /**
   * @param {Handle<AnimationClip>} handle
   */
  pause(handle) {
    const playback = this.get(handle)

    if (playback) {
      playback.pause()
    }

    return this
  }

  startAll() {
    this.animations.forEach((playback) => {
      playback.start()
    })

    return this
  }

  stopAll() {
    this.animations.forEach((playback) => {
      playback.stop()
    })

    return this
  }

  playAll() {
    this.animations.forEach((playback) => {
      playback.play()
    })

    return this
  }

  pauseAll() {
    this.animations.forEach((playback) => {
      playback.pause()
    })

    return this
  }
}

/**
 * Serialized form of `AnimationPlayer`.
 *
 * @typedef AnimationPlayerSerial
 * @property {[AssetId, any][]} animations
 * @property {number | null} current
 */

/**
 * @type {ComponentHook}
 */
export function dropAnimationPlayer(entity, world) {
  const player = world.get(entity, AnimationPlayer)

  if (!player) {
    return
  }

  player.handles.forEach((handle) => {
    handle.drop()
  })
  player.handles.clear()
  player.animations.clear()
}
