import { App, Plugin } from '../app/index.js'
import { AssetImporterPlugin, AssetPlugin, Assets } from '../asset/index.js'
import { AppSchedule } from '../core/index.js'
import { ComponentHooks } from '../ecs/index.js'
import { typeidGeneric } from '../type/index.js'
import { Audio } from './assets/index.js'
import { AudioPlayer, AudioOscillator, removeAudioPlayerSink, removeOscillatorSink } from './components/index.js'
import { AudioAdded, AudioDropped, AudioModified } from './events/index.js'
import { AudioCommands, AudioImporter, AudioAssets, AudioGraph } from './resources/index.js'
import { playAudio, playOscillators, registerAudioTypes } from './systems/index.js'

export class AudioPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const world = app.getWorld()
    const handler = new AudioCommands()

    app
      .registerType(AudioPlayer)
      .setComponentHooks(AudioPlayer, new ComponentHooks(
        null,
        removeAudioPlayerSink
      ))
      .registerType(AudioOscillator)
      .setComponentHooks(AudioOscillator, new ComponentHooks(
        null,
        removeOscillatorSink
      ))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerAudioTypes })
      .setResource(new AudioGraph())
      .setResource(handler)
      .registerPlugin(new AssetPlugin({
        asset: Audio,
        events: {
          added: AudioAdded,
          modified: AudioModified,
          dropped: AudioDropped
        }
      }))
      .registerPlugin(new AssetImporterPlugin({
        asset: Audio,
        importer: new AudioImporter()
      }))
      .registerSystem({ schedule: AppSchedule.Update, system: playAudio })
      .registerSystem({ schedule: AppSchedule.Update, system: playOscillators })

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
