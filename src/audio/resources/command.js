/** @import {PlaybackId} from '../typedef/index.js'*/
import { Audio } from '../assets/index.js'

/**
 * Manages playing of audio using Web Audio.
 */
export class AudioCommands {

  /**
   * Audio context to use.
   *
   * @private
   * @type {AudioContext}
   */
  ctx

  /**
   * List of audio buffers to use.
   *
   * @private
   * @type {AudioBufferSourceNode[]}
   */
  audio = []

  /**
   * @private
   * @type {number[]}
   */
  playbacks = []

  /**
   * Volume to resume playing when unmuted.
   *
   * @private
   * @type {number}
   */
  internalVolume = 1

  /**
   * Master volume for all sounds.
   *
   * @private
   * @type {GainNode}
   */
  masterGainNode

  /**
   * @param {AudioContext} ctx 
   */
  constructor(ctx = new AudioContext()) {
    this.ctx = ctx
    this.masterGainNode = ctx.createGain()
    this.masterGainNode.connect(ctx.destination)
  }

  /**
   * Plays a sound.
   *
   * @param {Audio} sound
   * @param {boolean} loop
   * @param {number} delay
   * @param {number} offset
   * @param {number} duration
   * @returns {PlaybackId}
   */
  play(sound, loop = false, delay = 0, offset = 0, duration = sound.audiobuffer.duration) {
    const source = this.ctx.createBufferSource()
    const id = this.audio.push(source) - 1

    source.buffer = sound.audiobuffer
    source.connect(this.masterGainNode)
    source.start(delay, offset, duration)
    source.loop = loop

    return this.playbacks.push(id) - 1
  }

  /**
   * @param {PlaybackId} id
   */
  stop(id) {
    const playback = this.playbacks[id]
    const audio = this.audio[playback]
    
    audio.disconnect()
    this.playbacks[id] = -1
  }

  /**
   * 
   */
  mute() {
    this.internalVolume = this.masterGainNode.gain.value
    this.masterGainNode.gain.value = 0
  }

  /**
   * 
   */
  unmute() {
    this.masterGainNode.gain.value = this.internalVolume
  }


  /** 
   * @returns {AudioContext}
   */
  getContext() {
    return this.ctx
  }
}