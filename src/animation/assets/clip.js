import { AnimationTrack } from '../core/index.js'

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

    if (tracks){
      tracks.push(track)
    } else{
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
}