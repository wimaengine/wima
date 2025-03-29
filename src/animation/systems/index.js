import { Handle } from '../../asset/index.js'
import { Query, World } from '../../ecs/index.js'

/**
 * @param {World} world
 */
export function advanceAnimationPlayers(world) {
  const players = new Query(world, ['animationplayer'])
  const dt = world.getResource('virtualclock').getDelta()
  
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
  const clips = world.getResource('assets<animationclip>')
  const players = new Query(world, ['animationplayer'])
  const targets = new Query(world, ['entity', 'animationtarget'])
  
  targets.each(([entity, target]) => {
    const play = players.get(target.player)

    if(!play)return

    const [player] = play

    player.animations.forEach((playback, handleid) => {
      const handle = new Handle(handleid)
      const clip = clips.getByHandle(handle)
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