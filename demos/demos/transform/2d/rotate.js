import {
  BasicMaterial,
  Demo,
  Mesh,
  World,
  Cleanup,
  EntityCommands,
  createMovable2D,
  Rotation2D,
  Meshed,
  BasicMaterial2D,
  PI,
  Query
} from 'wima'
import { addDefaultCamera2D, BasicMaterialAssets, MeshAssets } from '../../utils.js'

export default new Demo(
  'transform2d/rotate',
  [addmesh, addDefaultCamera2D],
  [update]
)

/**
 * @param {World} world
 */
function addmesh(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('rotate2d', Mesh.quad2D(50, 50))
  const material = materials.add('rotate2d', new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createMovable2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Cleanup()
    ])
    .insert(new Rotation2D(PI))
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const query = new Query(world, [Rotation2D, Meshed])

  query.each(([rotation]) => {
    rotation.value = PI
  })
}