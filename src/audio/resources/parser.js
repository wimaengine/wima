import { Parser } from '../../asset/index.js'
import { Audio } from '../assets/index.js'
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
   * @param {Device} _device
   */
  verify(extension, _device) {
    return document.createElement('audio').canPlayType(extension).length !== 0
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