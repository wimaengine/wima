import {
  Assets,
  WebglBasicMaterial,
  Demo,
  Material,
  Mesh,
  Orientation3D,
  Position3D,
  Scale3D,
  GlobalTransform3D,
  Rotation3D,
  World,
  Cleanup
} from 'wima'
import { addCamera3D } from './utils.js'

/**
 * @param {World} world
 */
function addmeshes(world) {

  /** @type {Assets<Mesh>} */
  const meshes = world.getResource('assets<mesh>')
  const commands = world.getResource('entitycommands')

  /** @type {Assets<Material>} */
  const materials = world.getResource('assets<material>')

  const geometries = [
    meshes.add('triangle', Mesh.triangle3D()),
    meshes.add('plane', Mesh.plane3D()),
    meshes.add('circle', Mesh.circle3D()),
    meshes.add('ring', Mesh.ring3D()),
    meshes.add('cone', Mesh.cone()),
    meshes.add('cube', Mesh.cube(0.7071, 0.7071, 0.7071)),
    meshes.add('uv sphere', Mesh.uvSphere()),
    meshes.add('torus', Mesh.torus()),
    meshes.add('cylinder', Mesh.cylinder())
  ]
  const material = materials.add('basic', new WebglBasicMaterial())

  const offsetX = -2.1,
    offsetY = 2,
    width = 1.1,
    height = 1.2,
    numX = 4
  
  for (let i = 0; i < geometries.length; i++) {
    commands
      .spawn()
      .insertPrefab([
        new Position3D(
          offsetX + width * (i % numX),
          offsetY - Math.floor(i / numX) * height,
          -1
        ),
        new Orientation3D(),
        new Scale3D(),
        new Rotation3D().fromEuler(0, Math.PI / 1000, 0),
        new GlobalTransform3D(),
        geometries[i],
        material,
        new Cleanup()
      ])
      .build()
  }
}

export const geometries = new Demo('mesh geometries', [addmeshes, addCamera3D])