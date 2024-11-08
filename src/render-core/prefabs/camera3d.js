import { Orientation3D, Position3D, Scale3D } from '../../transform/index.js'
import { Camera } from '../components/index.js'

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} ox 
 * @param {number} oy 
 * @param {number} oz 
 * @param {number} sx 
 * @param {number} sy 
 * @param {number} sz 
 * @returns {[Position3D,Orientation3D,Scale3D,Camera]}
 */
export function createCamera3D(
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
  return [
    new Position3D(x, y, z),
    new Orientation3D().fromEuler(ox, oy, oz),
    new Scale3D(sx, sy, sz),
    new Camera()
  ]
}