export class Sound {

  /**
   * @param {AudioBuffer} audiobuffer
   * @param {ArrayBuffer} raw
   */
  constructor(audiobuffer, raw) {
    this.audiobuffer = audiobuffer
    this.raw = raw
  }
}