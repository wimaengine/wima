import { AnimationClip } from './assets/index.js';
import { AppSchedule } from '../app/index.js';
import { Query } from '../ecs/index.js';
import { Playback } from './core/index.js';

export class AnimationPlugin {
  register(app) {
    app
      .registerAsset(AnimationClip)
      .registerSystem(AppSchedule.Update, advanceAnimations)
      .registerSystem(AppSchedule.Update, applyAnimations)
  }
}

function advanceAnimations(world) {
  const players = new Query(world, ['animationplayer'])
  const dt = world.getResource("virtualclock").getDelta()

  players.each(([player]) => {
    player.animations.forEach((playback) => {
      playback.update(dt)
    })
  })
}

function applyAnimations(world) {
  const animations = world.getResource("assets<animationclip>")
  const players = new Query(world, ['animationplayer'])
  const targets = new Query(world, ['animationtarget'])

  targets.each(([target]) => {
    //apply animation

  })
}