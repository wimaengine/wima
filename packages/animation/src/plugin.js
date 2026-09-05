import { App, Plugin } from '@wimaengine/app'
import { AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { TimePlugin } from '@wimaengine/time'
import { typeidGeneric, typeid } from '@wimaengine/type'
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

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(TimePlugin)]
  }
}
