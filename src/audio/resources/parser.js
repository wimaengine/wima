import { Parser } from '../../asset/index.js'
import { Audio } from '../assets/index.js'

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
    super(Audio)
    this.decoder = new OfflineAudioContext(options)
  }

  /**
   * @param {Response} response
   */
  async parse(response) {
    const raw = await response.arrayBuffer()
    const audiobuffer = await this.decoder.decodeAudioData(raw)

    return new Audio(audiobuffer)
  }

  getExtensions() {

    // audio capabilities
    const audio = document.createElement('audio')
    const extensions = []

    if (audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
      extensions.push('ogg')
    }
    if (audio.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
      extensions.push('mp3')
    }
    if (audio.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
      extensions.push('wav')
    }
    if (audio.canPlayType('audio/x-m4a;').replace(/^no$/, '') || audio.canPlayType('audio/aac;').replace(/^no$/, '')) {
      extensions.push('m4a')
    }

    return extensions
  }
}
