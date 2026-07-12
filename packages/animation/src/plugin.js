import { App, Plugin } from '@wimaengine/app'
import { AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { typeidGeneric } from '@wimaengine/type'
import { AnimationClip } from './assets'
import { AnimationPlayer, dropAnimationPlayer } from './components'
import { AnimationClipAssets } from './resources'
import { advanceAnimationPlayers, applyAnimations, registerAnimationTypes } from './systems'

export class AnimationPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setComponentHooks(AnimationPlayer, new ComponentHooks(
        null,
        dropAnimationPlayer
      ))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerAnimationTypes })
      .registerPlugin(new AssetPlugin({
        asset:AnimationClip
      }))
      .registerSystem({ schedule: AppSchedule.Update, system: advanceAnimationPlayers })
      .registerSystem({ schedule: AppSchedule.Update, system: applyAnimations })
      .setResourceAlias(typeidGeneric(Assets, [AnimationClip]), AnimationClipAssets)
  }
}
