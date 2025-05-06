import { Query, World } from '../../ecs/index.js'
import { Vector2, Vector3 } from '../../math/index.js'
import { Acceleration2D, Acceleration3D, Rotation2D, Rotation3D, Torque2D, Torque3D, Velocity2D, Velocity3D } from '../../movable/index.js'
import { Position2D } from '../../transform/index.js'

/**
 * @param {World} world
 */
export function updateVelocityEuler2D(world) {
  const query = new Query(world, [Velocity2D, Acceleration2D])
  const dt = 1 / 60

  query.each(([velocity, acceleration]) => {
    Vector2.set(
      velocity,
      velocity.x + acceleration.x * dt,
      velocity.y + acceleration.y * dt
    )
    Vector2.set(acceleration, 0, 0)
  })
}

/**
 * @param {World} world
 */
export function updateAngularEuler2D(world) {
  const query = new Query(world, [Rotation2D, Torque2D])
  const dt = 1 / 60

  query.each(([rotation, torque]) => {
    rotation.value += torque.value * dt
    torque.value = 0
  })
}

/**
 * @param {World} world
 */
export function updatePositionEuler2D(world) {
  const query = new Query(world, [Position2D, Velocity2D])
  const dt = 1 / 60

  query.each(([position, velocity]) => {
    Vector2.set(
      position,
      position.x + velocity.x * dt,
      position.y + velocity.y * dt
    )
  })
}

/**
 * @param {World} world
 */
export function updateOrientationEuler2D(world) {
  const query = new Query(world, ['orientation2d', 'rotation2d'])
  const dt = 1 / 60

  query.each(([orientation, rotation]) => {
    orientation.value += rotation.value * dt
  })
}


/**
 * @param {World} world
 */
export function updateVelocityEuler3D(world) {
  const query = new Query(world, [Velocity3D, Acceleration3D])
  const dt = 1 / 60

  query.each(([velocity, acceleration]) => {
    Vector3.set(
      velocity,
      velocity.x + acceleration.x * dt,
      velocity.y + acceleration.y * dt,
      velocity.z + acceleration.z * dt
    )
    Vector3.set(acceleration, 0, 0, 0)
  })
}

/**
 * @param {World} world
 */
export function updateAngularEuler3D(world) {
  const query = new Query(world, [Rotation3D, Torque3D])

  query.each(([rotation, torque]) => {

    // doesnt integrate dt,find a way to do that.
    rotation.multiply(torque)
    torque.set(0, 0, 0, 0)
  })
}

/**
 * @param {World} world
 */
export function updatePositionEuler3D(world) {
  const query = new Query(world, ['position3d', 'velocity3d'])
  const dt = 1 / 60

  query.each(([position, velocity]) => {
    Vector3.set(
      position,
      position.x + velocity.x * dt,
      position.y + velocity.y * dt,
      position.z + velocity.z * dt
    )
  })
}

/**
 * @param {World} world
 */
export function updateOrientationEuler3D(world) {
  const query = new Query(world, ['orientation3d', 'rotation3d'])

  query.each(([orientation, rotation]) => {

    // doesnt integrate dt,find a way to do that.
    orientation.multiply(rotation)
  })
}