import { PhysicsProperties } from '../components/index.js'
import { PhysicsHitbox } from '../../broadphase/index.js'
import { PhysicsSettings } from '../settings.js'
import { GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '../../transform/index.js'
import { createMovable2D, Velocity2D, Rotation2D, Acceleration2D, Torque2D } from '../../movable/index.js'

/**
 * @param {number} x
 * @param {number} y
 * @param {number} a
 * @param {number} mass
 * @param {number} restitution
 * @param {number} kineticfriction
 * @param {bigint} mask
 * @param {bigint} group
 * @returns {[Position2D,Orientation2D,Scale2D,GlobalTransform2D,Velocity2D,Rotation2D,Acceleration2D,Torque2D,PhysicsHitbox,PhysicsProperties]}
 */
export function createRigidBody2D(
  x = 0,
  y = 0,
  a = 0,
  mass = 1,
  restitution = PhysicsSettings.restitution,
  kineticfriction = PhysicsSettings.kineticFriction,
  mask = 0xFFFFFFFFn,
  group = 0xFFFFFFFFn
) {
  const properties = new PhysicsProperties()

  properties.invmass = mass === 0 ? 0 : 1 / mass
  properties.group = group
  properties.mask = mask
  properties.restitution = restitution
  properties.kineticFriction = kineticfriction

  return [
    ...createMovable2D(x, y, a),
    new PhysicsHitbox(),
    properties
  ]
}