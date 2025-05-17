import { Position2D, Orientation2D, Scale2D, GlobalTransform2D } from '../components/index.js'

/**
 * @param { number } dx
 * @param { number } dy
 * @param { number } a
 * @param { number } sx
 * @param { number } sy
 * @returns {[Position2D,Orientation2D,Scale2D,GlobalTransform2D]}
 */
export function createTransform2D(
  dx = 0,
  dy = 0,
  a = 0,
  sx = 1,
  sy = 1
) {
  return [
    new Position2D(dx, dy),
    new Orientation2D(a),
    new Scale2D(sx, sy),
    new GlobalTransform2D()
  ]
}