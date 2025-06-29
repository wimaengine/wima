export class Audio {

  /**
   * @param {AudioBuffer} audiobuffer
   * @param {ArrayBuffer} raw
   */
  constructor(audiobuffer, raw) {
    this.audiobuffer = audiobuffer
    this.raw = raw
  }

  static default(){
    return new Audio(new AudioBuffer({
      sampleRate:44800,
      length:1
    }), new ArrayBuffer(0))
  }
}