import {
  Assets,
  WebglBasicMaterial,
  Demo,
  Material,
  Mesh,
  PerspectiveProjection,
  Orientation3D,
  Position3D,
  Scale3D,
  GlobalTransform3D,
  Rotation3D,
  Camera,
  World,
  Cleanup,
  createCamera3D,
  EntityCommands
} from 'wima'

/**
 * @param {World} world
 */
function addCamera3D(world) {
  const commands = world.getResource(EntityCommands)
  const projection = new PerspectiveProjection()
  
  commands
    .spawn()
    .insertPrefab(createCamera3D(0, 0, 1))
    .insert(new Camera(projection))
    .insert(new Cleanup())
    .build()
}

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
      new Rotation3D().fromEuler(0, Math.PI / 100, 0),
      meshes.add('basic', mesh),
      materials.add('basic', material),
      new Cleanup()
    ])
    .build()
}

// Camera rotates about its local space.
export const perspectiveCamera = new Demo('perspective camera', [addmesh, addCamera3D])