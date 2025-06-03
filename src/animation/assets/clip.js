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
    if (!this.tracks.has(name))
      this.tracks.set(name, [])
    const tracks = this.tracks.get(name)
    tracks.push(track)
    return this
  }
  
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
    for (let tracks of this.tracks.values()) {
      for (let i = 0; i < tracks.length; i++) {
        if (!tracks[i].validate()) {
          return false
        }
      }
    }
    return true
  }
  
  static
  default () {
    return new AnimationClip()
  }
}