export class AnimationClip {
  /**
   * @type {Map<string,AnimationTrack[]>}
   */
  tracks = new Map()
  /**
   * @type {number}
   */
  duration = 0

  add(name, track) {
    if (!this.tracks.has(name))
      this.tracks.set(name, [])
    const tracks = this.tracks.get(name)
    tracks.push(track)
    return this
  }

  static
  default () {
    return new AnimationClip()
  }
}