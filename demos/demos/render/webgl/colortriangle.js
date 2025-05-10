import {
  Assets,
  Attribute,
  WebglBasicMaterial,
  Demo,
  Material,
  Mesh,
  Orientation3D,
  Position3D,
  Scale3D,
  GlobalTransform3D,
  World,
  Cleanup
} from 'wima'
import { addCamera3D } from './utils.js'

/**
 * @param {World} world
 */
function addmesh(world) {

  /** @type {Assets<Mesh>} */
  const meshes = world.getResourceByName('assets<mesh>')

  /** @type {Assets<Material>} */
  const materials = world.getResourceByName('assets<material>')

  const mesh = Mesh.triangle3D()
  const material = new WebglBasicMaterial({
    enableVertexColors:true,
    flags:1
  })

  mesh
    .setAttribute(
      'color',
      new Attribute(new Float32Array([
        1,
        0,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        1,
        1
      ]))
    )
  world.create([
    new Position3D(),
    new Orientation3D(),
    new Scale3D(),
    new GlobalTransform3D(),
    meshes.add('color', mesh),
    materials.add('color', material),
    new Cleanup()
  ])
}

export const colortriangle = new Demo('vertex colored triangle', [addmesh, addCamera3D], [])