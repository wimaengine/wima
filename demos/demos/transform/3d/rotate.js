import {
  BasicMaterial,
  Demo,
  Mesh,
  World,
  Cleanup,
  EntityCommands,
  createMovable3D,
  Rotation3D,
  Meshed,
  BasicMaterial3D,
  PI,
  Query
} from 'wima'
import { addDefaultCamera3D, BasicMaterialAssets, MeshAssets } from '../../utils.js'

export default new Demo(
  'transform3d/rotate',
  [addmesh, addDefaultCamera3D],
  [update]
)

/**
 * @param {World} world
 */
function addmesh(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('rotate3d', Mesh.triangle3D())
  const material = materials.add('rotate3d', new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createMovable3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Cleanup()
    ])
    .insert(new Rotation3D(0, PI, 0))
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const query = new Query(world, [Rotation3D, Meshed])

  query.each(([rotation]) => {
    rotation.y = PI 
  })
}