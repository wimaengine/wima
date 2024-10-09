import { Audio, Parser } from '../../asset/index.js'
import { Device } from '../../device/index.js'

/**
 * @augments {Parser<Audio>}
 */
export class AudioParser extends Parser {

  /**
   * @private
   * @type {OfflineAudioContext}
   */
  decoder

  /**
   * @param {OfflineAudioContextOptions} options
   */
  constructor(options = {
    sampleRate: 44100,
    length: 512
  }) {
    super()
    this.decoder = new OfflineAudioContext(options)
  }

  /**
   * @inheritdoc
   * @param {string} extension
   * @param {Device} device
   */
  verify(extension, device) {
    return device.capabilities.supportedAudioFormats.has(extension)
  }

  /**
   * @returns {Audio}
   */
  placeholder() {
    return new Audio(
      new AudioBuffer({
        sampleRate: 44100,
        length: 512
      }),
      new ArrayBuffer(0)
    )
  }

  /**
   * @param {Response} response
   */
  async parse(response) {
    const raw = await response.arrayBuffer()
    const audiobuffer = await this.decoder.decodeAudioData(raw)

    return new Audio(audiobuffer, raw)
  }
}