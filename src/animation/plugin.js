import { AnimationClip } from './assets/index.js';
import { AppSchedule } from '../app/index.js';
import { Query } from '../ecs/index.js';
import { AnimationPlayback } from './core/index.js';

export class AnimationPlugin {
  register(app) {
    app
      .registerAsset(AnimationClip)
      .registerSystem(AppSchedule.Update, advanceAnimations)
      .registerSystem(AppSchedule.Update, applyAnimations)
  }
}

function advanceAnimations(world) {
  const animations = world.getResource("assets<animationclip>")
  const players = new Query(world, ['animationplayer'])
  const dt = world.getResource("virtualclock").getDelta()


  players.each(([player]) => {
    player.animations.forEach((playback, handle) => {
      const clip = animations.get(handle)

      if (!playback.paused)
        playback.seekTime += dt * playback.speed
      if (playback.seekTime > clip.duration) {
        if (playback.repeat == AnimationRepeat.None) {
          playback.seekTime = Math.min(clip.duration, playback.seekTime)
          playback.paused = true
          return
        }
        if (playback.repeat == AnimationRepeat.Repeat) {
          playback.seekTime = playback.seekTime % clip.duration
        }
      }
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