import { App, Plugin } from '@wimaengine/app'
import { AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { typeidGeneric } from '@wimaengine/type'
import { AnimationClip } from './assets'
import { AnimationPlayer, AnimationTarget, dropAnimationPlayer } from './components'
import { AnimationClipAssets } from './resources'
import { advanceAnimationPlayers, applyAnimations, registerAnimationTypes } from './systems'

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
