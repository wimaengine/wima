import { Quaternion } from '../../math/index.js'
import { Orientation3D, Position3D, Scale3D, GlobalTransform3D } from '../../transform/index.js'
import { Camera, RenderLists3D } from '../components/index.js'
import { } from '../plugins/index.js'

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
 * @returns {[Position3D,Orientation3D,Scale3D,GlobalTransform3D,Camera,RenderLists3D]}
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
  const quaternion = Quaternion.fromEuler(ox, oy, oz)

  return [
    new Position3D(x, y, z),
    new Orientation3D().copy(quaternion),
    new Scale3D(sx, sy, sz),
    new GlobalTransform3D(),
    new Camera(),
    new RenderLists3D()
  ]
}