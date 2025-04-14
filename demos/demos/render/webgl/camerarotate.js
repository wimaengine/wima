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
  Cleanup,
  createCamera3D
} from 'wima'

/**
 * @param {World} world
 */
function addCamera3D(world) {
  const commands = world.getResource('entitycommands')

  commands
    .spawn()
    .insertPrefab(createCamera3D(0, 0, 1))
    .insert(new Rotation3D().fromEuler(0, Math.PI / 100, 0))
    .insert(new Cleanup())
    .build()
}

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
      new Scale3D(),
      new GlobalTransform3D(),
      meshes.add('basic', mesh),
      materials.add('basic', material),
      new Cleanup()
    ])
    .build()
}

// Camera rotates about its local space.
export const cameraRotate = new Demo('camera rotate', [addmesh, addCamera3D])