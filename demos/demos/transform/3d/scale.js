import {
  BasicMaterial,
  Demo,
  Mesh,
  Scale3D,
  World,
  Cleanup,
  Query,
  EntityCommands,
  VirtualClock,
  Meshed,
  BasicMaterial3D,
  createTransform3D
} from 'wima'
import { addDefaultCamera3D, BasicMaterialAssets, MeshAssets } from '../../utils.js'

export default new Demo(
  'transform3d/scale',
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

  const mesh = meshes.add('scale', Mesh.triangle3D())
  const material = materials.add('scale', new BasicMaterial())

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
  const query = new Query(world, [Scale3D, Meshed])
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()

  query.each(([scale]) => {
    scale.x = 1 + Math.sin(dt) * 0.5
    scale.y = 1 + Math.sin(dt) * 0.5
  })
}