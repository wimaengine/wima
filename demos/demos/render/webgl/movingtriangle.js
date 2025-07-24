import {
  Demo,
  Mesh,
  Position3D,
  World,
  Cleanup,
  Query,
  EntityCommands,
  VirtualClock,
  BasicMaterial,
  Meshed,
  BasicMaterial3D,
  createTransform3D,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera3D } from '../../utils.js'

export const movingtriangle = new Demo(
  'moving triangle',
  [addmesh, addDefaultCamera3D],
  [updateMesh]
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

/**
 * @param {World} world
 */
function updateMesh(world) {
  const query = new Query(world, [Position3D, Meshed])
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()

  query.each(([position]) => {
    position.x = Math.sin(dt) * 0.5
    position.y = Math.cos(dt) * 0.5
  })
}