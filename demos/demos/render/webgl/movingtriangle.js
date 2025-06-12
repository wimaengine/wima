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
  World,
  Cleanup,
  Query,
  MeshHandle,
  EntityCommands,
  VirtualClock
} from 'wima'
import { addCamera3D } from './utils.js'

/**
 * @param {World} world
 */
function addmesh(world) {
  const commands = world.getResource(EntityCommands)

  /** @type {Assets<Mesh>} */
  const meshes = world.getResourceByName('assets<mesh>')

  /** @type {Assets<Material>} */
  const materials = world.getResourceByName('assets<material>')

  const mesh = Mesh.triangle3D()
  const material = new WebglBasicMaterial()

  commands
    .spawn()
    .insertPrefab([
      new Position3D(),
      new Orientation3D(),
      new Scale3D(),
      new GlobalTransform3D(),
      meshes.add('basic', mesh),
      materials.add('basic', material),
      new Cleanup()
    ])
    .build()
}

/**
 * @param {World} world
 */
function updateMesh(world) {
  const query = new Query(world, [Position3D, MeshHandle])
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()

  query.each(([position]) => {
    position.x = Math.sin(dt) * 0.5
    position.y = Math.cos(dt) * 0.5
  })
}
export const movingtriangle = new Demo('moving triangle', [addmesh, addCamera3D], [updateMesh])