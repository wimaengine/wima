import {
  Demo,
  Mesh,
  World,
  Cleanup,
  EntityCommands,
  createTransform3D,
  BasicMaterial,
  Meshed,
  BasicMaterial3D,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera3D } from '../../utils.js'

export const basictriangle = new Demo(
  'basic triangle',
  [addmesh, addDefaultCamera3D]
)

/**
 * @param {World} world
 */
function addmesh(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('basic', Mesh.triangle3D())
  const material = materials.add('basic', new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Cleanup()
    ])
    .build()
}