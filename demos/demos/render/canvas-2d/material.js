import {
  Mesh,
  createTransform2D,
  World,
  Demo,
  Cleanup,
  EntityCommands,
  BasicMaterial,
  Meshed,
  BasicMaterial2D,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera2D } from '../../utils.js'

export default new Demo(
  'materials',
  [init, addDefaultCamera2D]
)

/**
 * @param {World} world
 */
export async function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const basicMaterials = world.getResource(BasicMaterialAssets)
  
  const mesh = meshes.add(Mesh.quad2D(50, 50))
  const material = basicMaterials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(-120, 0),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Cleanup()
    ])
    .build()
}