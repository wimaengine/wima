import { Handle } from '../asset/index.js';
import { AnimationClip } from './assets/index.js';
import { AppSchedule } from '../app/index.js';
import { Query } from '../ecs/index.js';
import { Playback, KeyFrameType } from './core/index.js';
import { AnimationPlayer, AnimationTarget } from "./components/index.js"

export class AnimationPlugin {
  register(app) {
    app
      .registerType(AnimationPlayer)
      .registerType(AnimationTarget)
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
  const clips = world.getResource("assets<animationclip>")
  const players = new Query(world, ['animationplayer'])
  const targets = new Query(world, ['entity', 'animationtarget'])
  
  targets.each(([entity, target]) => {
    const [player] = players.get(target.player)
    player.animations.forEach((playback, handleid) => {
      const handle = new Handle(handleid)
      const clip = clips.getByHandle(handle)
      const tracks = clip.getTracks(target.id)
      
      if (!tracks) return
      
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        // In order to get stuff running,
        // i will apply animations to specific components and assume a lot of stuff here:
        // Might make this generic in the future i.e apply to arbitrary
        // components and their fields.
        // When proper type reflection lands, i will revisit this.
        switch (track.type) {
          case KeyFrameType.Position2D:
            const position2d = world.get(entity, 'position2d')
            
            if (!position2d) continue
            
            const currentPos2 = track.getCurrent(playback.elapsed)
            
            position2d.set(
              currentPos2[0],
              currentPos2[1]
            )
            break
          case KeyFrameType.Orientation2D:
            const orientation2d = world.get(entity, 'orientation2d')
            
            if (!orientation2d) continue
            
            const currentOr2 = track.getCurrent(playback.elapsed)
            
            orientation2d.value = currentOr2[0]
            break
          case KeyFrameType.Scale2D:
            const scale2d = world.get(entity, 'scale2d')
            
            if (!scale2d) continue

            const currentSc2 = track.getCurrent(playback.elapsed)
            
            scale2d.set(
              currentSc2[0],
              currentSc2[1]
            )
            break
          case KeyFrameType.Position3D:
            const position3d = world.get(entity, 'position3d')
            
            if (!position3d) continue

            const currentPos3 = track.getCurrent(playback.elapsed)
            
            position3d.set(
              currentPos3[0],
              currentPos3[1],
              currentPos3[2]
            )
            break
          case KeyFrameType.Orientation3D:
            const orientation3d = world.get(entity, 'orientation3d')
            
            if (!orientation3d) continue

            const currentOr3 = track.getCurrent(playback.elapsed)
            
            
            orientation3d.set(
              currentOr3[0],
              currentOr3[1],
              currentOr3[2],
              currentOr3[3]
            )
            break
          case KeyFrameType.Scale3D:
            const scale3d = world.get(entity, 'scale3d')
            
            if (!scale3d) continue

            const currentSc3 = track.getCurrent(playback.elapsed)
            
            
            scale3d.set(
              currentSc3[0],
              currentSc3[1],
              currentSc3[2]
            )
            break
        }
      }
    })
  })
}