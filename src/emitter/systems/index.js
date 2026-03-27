import { Entity, has, Query, World } from '../../ecs/index.js'
import { Timer } from '../../time/index.js'
import { EntityCommands } from '../../command/index.js'
import { Position2D, Orientation2D, GlobalTransform2D, GlobalTransform3D, Orientation3D, Position3D, Scale3D } from '../../transform/index.js'
import { Particle, Emitter } from '../components/index.js'

/**
 * @param {World} world
 */
export function emitParticles2D(world) {
  const emitters = new Query(world, [GlobalTransform2D, Emitter, Timer])
  const commands = new EntityCommands(world)

  emitters.each(([transform, emitter, timer]) => {
    if (!emitter.enabled || !timer.cycleStarted()) return

    const { prefab, patch } = emitter
    const [position, orientation] = transform.decompose()
    const burstCount = Math.round(emitter.burstCount.lerp(Math.random()))

    for (let i = 0; i < burstCount; i++) {
      const orient = new Orientation2D().copy(orientation)
      const lifetime = emitter.lifetime.lerp(Math.random())
      const particle = prefab ? prefab() : []

      // TODO: Sometimes one would want to just parent the entity to this emitter,
      // maybe introduce a mode for that e.g World space or local space placement
      // This places entity in world space.
      const particleEntity = commands
        .spawn()
        .insertPrefab([
          ...particle,
          new Position2D().copy(position),
          orient,

          // TODO: Sometimes you may not want to tack
          // on this marker,add an option to disable adding it
          // on an emitter.
          new Particle(),
          new Timer({ duration:lifetime })
        ])
        .build()

      if (patch) {
        patch(commands, particleEntity)
      }
    }
  })
}

/**
 * @param {World} world
 */
export function emitParticles3D(world) {
  const emitters = new Query(world, [GlobalTransform3D, Emitter, Timer])
  const commands = new EntityCommands(world)

  emitters.each(([transform, emitter, timer]) => {
    if (!emitter.enabled || !timer.cycleStarted()) return

    const [position, orientation, scale] = transform.decompose()
    const burstCount = Math.round(emitter.burstCount.lerp(Math.random()))

    for (let i = 0; i < burstCount; i++) {
      const { prefab, patch } = emitter
      const lifetime = emitter.lifetime.lerp(Math.random())
      const particle = prefab ? prefab() : []

      // TODO: Sometimes one would want to just parent the entity to this emitter,
      // maybe introduce a mode for that e.g World space or local space placement
      // This places entity in world space.
      const particleEntity = commands
        .spawn()
        .insertPrefab([
          ...particle,
          new Position3D().copy(position),
          new Orientation3D().copy(orientation),
          new Scale3D().copy(scale),
          new Particle(),
          new Timer({ duration: lifetime })
        ])
        .build()

      if (patch) {
        patch(commands, particleEntity)
      }
    }
  })
}

// TODO: Move to time module.It seems that this functionality can be
// tacked onto Timer using another component to mark the entity as
// despawning when timer is done
/**
 * @param {World} world
 */
export function despawnParticles(world) {
  const particles = new Query(world, [Entity, Timer], [has(Particle)])
  const commands = new EntityCommands(world)

  particles.each(([entity, timer]) => {
    if (timer.completed()) {
      commands.despawn(entity)
    }
  })
}
