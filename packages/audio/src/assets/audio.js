export class Audio {

  /**
   * @type {AudioBuffer}
   */
  audiobuffer

  /**
   * @param {AudioBuffer} audiobuffer
   */
  constructor(audiobuffer) {
    this.audiobuffer = audiobuffer
  }

  static default() {
    return new Audio(new AudioBuffer({
      sampleRate:44800,
      length:1
    }))
  }
}
