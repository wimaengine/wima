import { App, Plugin } from '../app/index.js'
import { AssetParserPlugin, AssetPlugin, Audio } from '../asset/index.js'
import { AudioCommands, AudioParser } from './resources/index.js'

export class AudioPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const handler = new AudioCommands()

    app
      .setResource(handler)
      .registerPlugin(new AssetPlugin({
        asset:Audio
      }))
      .registerPlugin(new AssetParserPlugin({
        asset:Audio,
        parser:new AudioParser()
      }))
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