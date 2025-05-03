import { GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '../../transform/index.js'
import { Camera } from '../components/index.js'

/**
 * @param {number} x
 * @param {number} y
 * @param {number} a
 * @param {number} sx
 * @param {number} sy
 * @returns {[Position2D,Orientation2D,Scale2D,GlobalTransform2D,Camera]}
 */
export function createCamera2D(x = 0, y = 0, a = 0, sx = 1, sy = 1) {
  return [new Position2D(x, y), new Orientation2D(a), new Scale2D(sx, sy), new GlobalTransform2D(), new Camera()]
}