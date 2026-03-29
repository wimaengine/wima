/** @import { PlaybackSettings } from '../core/index.js'*/
/** @import { AssetId } from '../../asset/index.js'*/
import { Handle } from '../../asset/index.js'
import { Playback } from '../core/index.js'
import { AnimationClip } from '../assets/index.js'

export class AnimationPlayer {

  /**
   * @type {Map<AssetId,Playback>}
   */
  animations = new Map()

  /**
   * @type {number | null}
   */
  current = null

  /**
   * @param {AnimationPlayer} source
   * @param {AnimationPlayer} target
   */
  static copy(source, target = new AnimationPlayer()) {
    const animations = new Map()

    source.animations.forEach((playback, id) => {
      animations.set(id, Playback.copy(playback))
    })

    target.animations = animations
    target.current = source.current

    return target
  }

  /**
   * @param {AnimationPlayer} target
   */
  static clone(target) {
    return this.copy(target)
  }

  /**
   * @param {Handle<AnimationClip>} handle
   * @param {PlaybackSettings} settings
   */
  set(handle, settings) {
    const playback = new Playback(settings)

    this.animations.set(handle.id(), playback)

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
    this.animations.delete(handle.id())

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
