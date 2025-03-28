/** @import { PlaybackSettings } from '../core/index.js'*/
import { Handle } from '../../asset/index.js'
import { Playback } from '../core/index.js'
import { AnimationClip } from '../assets/index.js'

export class AnimationPlayer {

  /**
   * @type {Map<number,Playback>}
   */
  animations = new Map()

  /**
   * @type {number | null}
   */
  current = null

  /**
   * @param {Handle<AnimationClip>} handle
   * @param {PlaybackSettings} settings
   */
  set(handle, settings) {
    const playback = new Playback(settings)

    this.animations.set(handle.handle, playback)

    return this
  }

  /**
   * @param {Handle<AnimationClip>} handle
   */
  get(handle) {
    return this.animations.get(handle.handle)
  }
  
  /**
   * @param {Handle<AnimationClip>} handle
   */
  delete(handle) {
    this.animations.delete(handle.handle)

    return this
  }

  /**
   * @param {Handle<AnimationClip>} handle
   */
  start(handle) {
    const playback = this.get(handle)

    if(playback){
      playback.start()
    }

    return this
  }
  
  /**
   * @param {Handle<AnimationClip>} handle
   */
  stop(handle) {
    const playback = this.get(handle)

    if(playback){
      playback.stop()
    }

    return this
  }
  
  /**
   * @param {Handle<AnimationClip>} handle
   */
  play(handle) {
    const playback = this.get(handle)

    if(playback){
      playback.play()
    }

    return this
  }
  
  /**
   * @param {Handle<AnimationClip>} handle
   */
  pause(handle) {
    const playback = this.get(handle)

    if(playback){
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