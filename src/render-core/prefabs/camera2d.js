import { createTransform2D, GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '../../transform/index.js'
import { Camera, RenderLists2D } from '../components/index.js'

/**
 * @param {number} x
 * @param {number} y
 * @param {number} a
 * @param {number} sx
 * @param {number} sy
 * @returns {[Position2D,Orientation2D,Scale2D,GlobalTransform2D,Camera,RenderLists2D]}
 */
export function createCamera2D(x = 0, y = 0, a = 0, sx = 1, sy = 1) {
  return [...createTransform2D(x, y, a, sx, sy), new Camera(), new RenderLists2D()]
}
