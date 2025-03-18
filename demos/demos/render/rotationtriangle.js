import {
  Assets,
  WebglBasicMaterial,
  Demo,
  Material,
  Mesh,
  Orientation3D,
  Position3D,
  Scale3D,
  World,
  Cleanup,
  GlobalTransform3D,
  Rotation3D
} from 'wima'
import { addCamera3D } from './utils.js'

/**
 * @param {World} world
 */
function addmesh(world) {

  /** @type {Assets<Mesh>} */
  const meshes = world.getResource('assets<mesh>')
  const commands = world.getResource('entitycommands')

  /** @type {Assets<Material>} */
  const materials = world.getResource('assets<material>')

  const mesh = Mesh.triangle3D()
  const material = new WebglBasicMaterial()

  commands
    .spawn()
    .insertPrefab([
      new Position3D(),
      new Orientation3D(),
      new Rotation3D().fromEuler(0, 0, Math.PI / 1000),
      new Scale3D(),
      new GlobalTransform3D(),
      meshes.add('basic', mesh),
      materials.add('basic', material),
      new Cleanup()
    ])
    .build()
}

export const rotatingtriangle = new Demo('rotating triangle', [addmesh, addCamera3D], [])