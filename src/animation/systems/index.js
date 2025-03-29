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