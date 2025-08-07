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

  getExtensions(){
    // audio capabilities
    const audio = document.createElement('audio')
    const extensions = new Set()

    if (audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
      extensions.add('ogg')
    }
    if (audio.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
      extensions.add('mp3')
    }
    if (audio.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
      extensions.add('wav')
    }
    if (audio.canPlayType('audio/x-m4a;').replace(/^no$/, '') || audio.canPlayType('audio/aac;').replace(/^no$/, '')) {
      extensions.add('m4a')
    }
    return extensions
  }
}