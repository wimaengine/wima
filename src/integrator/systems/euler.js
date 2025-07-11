import { Query, World } from '../../ecs/index.js'
import { Quaternion, Vector2, Vector3 } from '../../math/index.js'
import { Acceleration2D, Acceleration3D, Rotation2D, Rotation3D, Torque2D, Torque3D, Velocity2D, Velocity3D } from '../../movable/index.js'
import { Orientation2D, Orientation3D, Position2D, Position3D } from '../../transform/index.js'

/**
 * @param {World} world
 */
export function updateVelocityEuler2D(world) {
  const query = new Query(world, [Velocity2D, Acceleration2D])
  const dt = 1 / 60

  query.each(([velocity, acceleration]) => {
    Vector2.set(
      velocity.x + acceleration.x * dt,
      velocity.y + acceleration.y * dt,
      velocity
    )
    Vector2.set(0, 0, acceleration)
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
  const query = new Query(world, [Orientation2D, Rotation2D])
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
  const dt = 1 / 60

  query.each(([rotation, torque]) => {
    const temp = Vector3.multiplyScalar(torque, dt)

    rotation.add(temp)
    torque.set(0, 0, 0)
  })
}

/**
 * @param {World} world
 */
export function updatePositionEuler3D(world) {
  const query = new Query(world, [Position3D, Velocity3D])
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
  const query = new Query(world, [Orientation3D, Rotation3D])
  const dt = 1 / 60 

  query.each(([orientation, rotation]) => {
    const temp1 = Vector3.multiplyScalar(rotation, dt)
    const temp = Quaternion.fromEuler(temp1.x, temp1.y, temp1.z)

    orientation.multiply(temp)
    orientation.normalize()
    
  })
}