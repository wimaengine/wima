import {
  BasicMaterial,
  Demo,
  Mesh,
  Position2D,
  World,
  Cleanup,
  Query,
  EntityCommands,
  VirtualClock,
  BasicMaterial2D,
  Meshed,
  createTransform2D,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera2D } from '../../utils.js'

export default new Demo(
  'transform2d/translate',
  [addmesh, addDefaultCamera2D],
  [updateMesh]
)

/**
 * @param {World} world
 */
function addmesh(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('scale', Mesh.quad2D(50, 50))
  const material = materials.add('scale', new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Cleanup()
    ])
    .build()
}

/**
 * @param {World} world
 */
function updateMesh(world) {
  const query = new Query(world, [Position2D, Meshed])
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()

  query.each(([position]) => {
    position.x = Math.sin(dt) * 100
    position.y = Math.cos(dt) * 100
  })
}