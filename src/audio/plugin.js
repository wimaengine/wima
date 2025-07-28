import { App, Plugin } from '../app/index.js'
import { AssetParserPlugin, AssetPlugin, Assets } from '../asset/index.js'
import { typeidGeneric } from '../reflect/index.js'
import { Audio } from './assets/index.js'
import { AudioAdded, AudioDropped, AudioModified } from './events/index.js'
import { AudioCommands, AudioParser, AudioAssets } from './resources/index.js'

export class AudioPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const world = app.getWorld()
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
        asset: Audio,
        parser: new AudioParser()
      }))
    window.addEventListener('pointerdown', resumeAudio)

    world.setResourceAlias(typeidGeneric(Assets, [Audio]), AudioAssets)

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