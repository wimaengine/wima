import { App, AppSchedule, Plugin } from '../app/index.js'
import { AssetParserPlugin, AssetPlugin, Assets } from '../asset/index.js'
import { ComponentHooks } from '../ecs/index.js'
import { typeidGeneric } from '../reflect/index.js'
import { Audio } from './assets/index.js'
import { AudioPlayer, AudioOscillator, removeAudioPlayerSink, removeOscillatorSink } from './components/index.js'
import { AudioAdded, AudioDropped, AudioModified } from './events/index.js'
import { AudioCommands, AudioParser, AudioAssets, AudioGraph } from './resources/index.js'
import { playAudio, updatePlayers, playOscillators, updateOscillators } from './systems/index.js'

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
      .registerPlugin(new AssetParserPlugin({
        asset: Audio,
        parser: new AudioParser()
      }))
      .registerSystem(AppSchedule.Update, playAudio)
      .registerSystem(AppSchedule.Update, playOscillators)
      .registerSystem(AppSchedule.Update, updatePlayers)
      .registerSystem(AppSchedule.Update, updateOscillators)

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