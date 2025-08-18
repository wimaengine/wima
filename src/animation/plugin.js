import { App, AppSchedule, Plugin } from '../app/index.js'
import { AssetPlugin, Assets } from '../asset/index.js'
import { typeidGeneric } from '../reflect/index.js'
import { AnimationClip } from './assets/index.js'
import { AnimationPlayer, AnimationTarget } from './components/index.js'
import { AnimationClipAssets } from './resources/index.js'
import { advanceAnimationPlayers, applyAnimations } from './systems/index.js'

export class AnimationPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const world = app.getWorld()
    
    app
      .registerType(AnimationPlayer)
      .registerType(AnimationTarget)
      .registerPlugin(new AssetPlugin({
        asset:AnimationClip
      }))
      .registerSystem(AppSchedule.Update, advanceAnimationPlayers)
      .registerSystem(AppSchedule.Update, applyAnimations)
    world.setResourceAlias(typeidGeneric(Assets, [AnimationClip]), AnimationClipAssets)
  }
}