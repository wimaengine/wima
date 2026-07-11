import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { VirtualClock } from '@wimaengine/time'
import { AnimationPlayer, AnimationTarget } from '../components'
import { AnimationClipAssets } from '../resources'

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
  const targets = new Query(world, [EntityHandle, AnimationTarget])

  targets.each(([entity, target]) => {
    const play = players.get(target.player)

    if (!play) return

    const [player] = play

    player.animations.forEach((playback, assetId) => {

      const clip = clips.getByAssetId(assetId)
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
