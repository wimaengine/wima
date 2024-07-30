export class Sound {

  /**
   * @param {AudioBuffer} audiobuffer
   * @param {ArrayBuffer} raw
   */
  constructor(audiobuffer, raw) {
    this.audiobuffer = audiobuffer
    this.raw = raw
  }
  static PLACEHOLDER = new Sound(
    new AudioBuffer({
      sampleRate: 44100,
      length: 512
    }),
    new ArrayBuffer(0)
  )
}