import { Quaternion } from '../../math/index.js'
import { Position3D, Orientation3D, Scale3D, GlobalTransform3D } from '../components/index.js'

/**
 * @param { number } x
 * @param { number } y
 * @param { number } z
 * @param { number } [ox=0]
 * @param { number } [oy=0]
 * @param { number } [oz=0]
 * @param { number } sx
 * @param { number } sy
 * @param { number } sz
 * @returns {[Position3D,Orientation3D,Scale3D,GlobalTransform3D]}
 */
export function createTransform3D(
  x = 0,
  y = 0,
  z = 0,
  ox = 0,
  oy = 0,
  oz = 0,
  sx = 1,
  sy = 1,
  sz = 1
) {
    const quaternion = Quaternion.fromEuler(ox,oy,oz)
  
  return [
    new Position3D(x, y, z),
    new Orientation3D().copy(quaternion),
    new Scale3D(sx, sy, sz),
    new GlobalTransform3D()
  ]
}