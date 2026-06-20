import { Handle } from '../../asset/index.js'
import {
  createTransform2D,
  createTransform3D,
  GlobalTransform2D,
  GlobalTransform3D,
  Orientation2D,
  Orientation3D,
  Position2D,
  Position3D,
  Scale2D,
  Scale3D
} from '../../transform/index.js'
import { BasicMaterial, Mesh } from '../assets/index.js'
import { BasicMaterialInstance, Meshed } from '../components/index.js'

/**
 * @param {Handle<Mesh>} [mesh]
 * @param {Handle<BasicMaterial>} [material]
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [a=0]
 * @param {number} [sx=1]
 * @param {number} [sy=1]
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Meshed, BasicMaterialInstance]}
 */
export function createBasicMesh2D(mesh, material, x = 0, y = 0, a = 0, sx = 1, sy = 1) {
  return [
    ...createTransform2D(x, y, a, sx, sy),
    new Meshed(mesh),
    new BasicMaterialInstance(material)
  ]
}

/**
 * @param {Handle<Mesh>} [mesh]
 * @param {Handle<BasicMaterial>} [material]
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @param {number} [ox=0]
 * @param {number} [oy=0]
 * @param {number} [oz=0]
 * @param {number} [sx=1]
 * @param {number} [sy=1]
 * @param {number} [sz=1]
 * @returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D, Meshed, BasicMaterialInstance]}
 */
export function createBasicMesh3D(
  mesh,
  material,
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
    ...createTransform3D(x, y, z, ox, oy, oz, sx, sy, sz),
    new Meshed(mesh),
    new BasicMaterialInstance(material)
  ]
}
