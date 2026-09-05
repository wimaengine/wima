import { App, Plugin } from '@wimaengine/app'
import { AssetImporterPlugin, AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { TimePlugin } from '@wimaengine/time'
import { typeidGeneric, typeid } from '@wimaengine/type'
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
    const handler = new AudioCommands()

    app
      .setComponentHooks(AudioPlayer, new ComponentHooks(
        null,
        removeAudioPlayerSink
      ))
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
      .setResourceAlias(typeidGeneric(Assets, [Audio]), AudioAssets)

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

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(TimePlugin)]
  }
}
