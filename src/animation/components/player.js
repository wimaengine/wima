import { AnimationPlayback } from "../core/index.js"
import { AnimationClip } from "../assets/index.js"

export class AnimationPlayer {
  /**
   * @private
   * @type {Map<number,AnimationPlayback>}
   */
  animations = new Map()
  /**
   * @param {Handle<AnimationClip>} clip
   */
  play(clip,settings) {
    const playback = new AnimationPlayback()
    this.animations.set(clip.handle,playback)
  }
  /**
   * @param {Handle<AnimationClip>} clip
   */
  stop(clip) {
    this.animations.delete(clip.handle)
  }
  /**
   * @param {Handle<AnimationClip>} clip
   */
  pause(clip) {}
  /**
   * @param {Handle<AnimationClip>} clip
   */
  resume(clip) {}
}