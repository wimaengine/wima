import { App, Plugin } from '@wimaengine/app'
import { AssetImporterPlugin, AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { typeidGeneric } from '@wimaengine/type'
import { Audio } from './assets'
import { AudioPlayer, AudioOscillator, removeAudioPlayerSink, removeOscillatorSink } from './components'
import { AudioAdded, AudioDropped, AudioModified } from './events'
import { AudioCommands, AudioImporter, AudioAssets, AudioGraph } from './resources'
import { playAudio, playOscillators, registerAudioTypes } from './systems'

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
