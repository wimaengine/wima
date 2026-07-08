/** @import { AnimationTrackSerial } from '../core' */
import { AnimationTrack } from '../core'

export class AnimationClip {

  /**
   * @type {Map<string,AnimationTrack[]>}
   */
  tracks = new Map()

  /**
   * @type {number}
   */
  duration = 0

  /**
   * @param {string} name
   * @param {AnimationTrack} track
   * @returns {this}
   */
  add(name, track) {
    const tracks = this.tracks.get(name)

    if (tracks) {
      tracks.push(track)
    } else {
      this.tracks.set(name, [track])
    }

    return this
  }

  /**
   * @param {string} id
   */
  getTracks(id) {
    return this.tracks.get(id)
  }

  /**
   * @param {string} name
   * @returns {void}
   */
  remove(name) {
    this.tracks.delete(name)
  }

  calculateDuration() {
    this.duration = 0
    this.tracks.forEach((tracks) => {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const contender = track.times[track.times.length - 1]

        if (this.duration < contender) {
          this.duration = contender
        }
      }
    })
  }

  validate() {
    for (const tracks of this.tracks.values()) {
      for (let i = 0; i < tracks.length; i++) {
        if (!tracks[i].validate()) {
          return false
        }
      }
    }

    return true
  }

  static
  default() {
    return new AnimationClip()
  }

  /**
   * @param {AnimationClip} value
   */
  static serialize(value) {
    return {
      duration: value.duration,
      tracks: Array.from(value.tracks.entries()).map(([name, tracks]) => [
        name,
        tracks.map((track) => AnimationTrack.serialize(track))
      ])
    }
  }

  /**
   * @param {unknown} value
   * @returns {value is AnimationClipSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('duration' in value) || !('tracks' in value)) {
      return false
    }

    if (typeof value.duration !== 'number' || !Array.isArray(value.tracks)) {
      return false
    }

    for (let i = 0; i < value.tracks.length; i++) {
      const entry = value.tracks[i]

      if (!Array.isArray(entry) || entry.length !== 2) {
        return false
      }

      const [name, tracks] = entry

      if (typeof name !== 'string' || !Array.isArray(tracks)) {
        return false
      }

      for (let j = 0; j < tracks.length; j++) {
        if (!AnimationTrack.validateSerial(tracks[j])) {
          return false
        }
      }
    }

    return true
  }

  /**
   * @param {AnimationClipSerial} value
   * @param {AnimationClip} [out]
   */
  static deserialize(value, out = new AnimationClip()) {
    out.duration = value.duration
    out.tracks = new Map(
      value.tracks.map(([name, tracks]) => [
        name,
        tracks.map((track) => AnimationTrack.deserialize(track))
      ])
    )

    return out
  }
}

/**
 * Serialized form of `AnimationClip`.
 *
 * @typedef AnimationClipSerial
 * @property {number} duration
 * @property {[string, AnimationTrackSerial[]][]} tracks
 */
