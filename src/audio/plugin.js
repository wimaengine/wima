import { App } from '../app/index.js'
import { Audio } from './assets/index.js'
import { AudioCommands, AudioParser } from './resources/index.js'

export class AudioPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    const handler = new AudioCommands()

    app
      .setResource(handler)
      .registerAsset(Audio)
      .registerAssetParser(Audio, new AudioParser())
    window.addEventListener('pointerdown', resumeAudio)

    /** */
    function resumeAudio() {
      const ctx = handler.getContext()

      ctx.resume()

      if (ctx.state === 'running') {
        removeEventListener('pointerdown', resumeAudio)
      }
    }
  }
}