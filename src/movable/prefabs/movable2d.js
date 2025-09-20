import { createTransform2D, GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '../../transform/index.js'
import { Velocity2D, Rotation2D, Acceleration2D, Torque2D } from '../components/index.js'

/**
 * @param {number | undefined} x
 * @param {number | undefined} y
 * @param {number | undefined} a
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Velocity2D, Rotation2D, Acceleration2D, Torque2D]}
 */
export function createMovable2D(x = 0, y = 0, a = 0) {
  return [...createTransform2D(x, y, a), new Velocity2D(), new Rotation2D(), new Acceleration2D(), new Torque2D()]
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} a
 * @returns {[Velocity2D,Rotation2D,Acceleration2D,Torque2D]}
 */
export function createRawMovable2D(x = 0, y = 0, a = 0) {
  return [new Velocity2D(x, y), new Rotation2D(a), new Acceleration2D(), new Torque2D()]
}