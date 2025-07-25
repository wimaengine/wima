import { App, Plugin } from '../app/index.js'
import { AssetParserPlugin, AssetPlugin } from '../asset/index.js'
import { Audio } from './assets/index.js'
import { AudioAdded, AudioDropped, AudioModified } from './events/index.js'
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
        asset:Audio,
        events:{
          added:AudioAdded,
          modified:AudioModified,
          dropped:AudioDropped
        }
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