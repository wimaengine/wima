import { Handle } from '../../asset/index.js'
import { Entity, Query, World } from '../../ecs/index.js'
import { VirtualClock } from '../../time/index.js'
import { AnimationPlayer, AnimationTarget } from '../components/index.js'
import { AnimationClipAssets } from '../resources/index.js'

/**
 * @param {World} world
 */
export function advanceAnimationPlayers(world) {
  const players = new Query(world, [AnimationPlayer])
  const dt = world.getResource(VirtualClock).getDelta()
  
  players.each(([player]) => {
    player.animations.forEach((playback) => {
      playback.update(dt)
    })
  })
}

/**
 * @param {World} world
 */
export function applyAnimations(world) {
  const clips = world.getResource(AnimationClipAssets)
  const players = new Query(world, [AnimationPlayer])
  const targets = new Query(world, [Entity, AnimationTarget])
  
  targets.each(([entity, target]) => {
    const play = players.get(target.player)

    if(!play)return

    const [player] = play

    player.animations.forEach((playback, handleid) => {
      const handle = new Handle(clips, handleid)
      const clip = clips.get(handle)
      const tracks = clip.getTracks(target.id)

      if (!tracks) return
      
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const current = track.getCurrent(playback.elapsed)
        
        // In the future, i might implement this using type reflection when it lands to allow arbitrary 
        // components without needing the current effector implementation.
        
        track.effector.apply(world, entity, current)
      }
    })
  })
}