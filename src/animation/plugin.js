import { App, Plugin } from '../app/index.js'
import { AssetPlugin, Assets } from '../asset/index.js'
import { AppSchedule } from '../core/index.js'
import { ComponentHooks } from '../ecs/index.js'
import { typeidGeneric } from '../type/index.js'
import { AnimationClip } from './assets/index.js'
import { AnimationPlayer, AnimationTarget, dropAnimationPlayer } from './components/index.js'
import { AnimationClipAssets } from './resources/index.js'
import { advanceAnimationPlayers, applyAnimations, registerAnimationTypes } from './systems/index.js'

export class AnimationPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const world = app.getWorld()

    app
      .registerType(AnimationPlayer)
      .setComponentHooks(AnimationPlayer, new ComponentHooks(
        null,
        dropAnimationPlayer
      ))
      .registerType(AnimationTarget)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerAnimationTypes })
      .registerPlugin(new AssetPlugin({
        asset:AnimationClip
      }))
      .registerSystem({ schedule: AppSchedule.Update, system: advanceAnimationPlayers })
      .registerSystem({ schedule: AppSchedule.Update, system: applyAnimations })
    world.setResourceAlias(typeidGeneric(Assets, [AnimationClip]), AnimationClipAssets)
  }
}
