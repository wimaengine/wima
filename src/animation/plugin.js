import { App, AppSchedule } from '../app/index.js'
import { AnimationClip } from './assets/index.js'
import { AnimationPlayer, AnimationTarget } from './components/index.js'
import { advanceAnimationPlayers, applyAnimations } from './systems/index.js'

export class AnimationPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(AnimationPlayer)
      .registerType(AnimationTarget)
      .registerAsset(AnimationClip)
      .registerSystem(AppSchedule.Update, advanceAnimationPlayers)
      .registerSystem(AppSchedule.Update, applyAnimations)
  }
}