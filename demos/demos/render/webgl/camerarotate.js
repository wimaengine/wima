import {
  Demo,
  Mesh,
  Rotation3D,
  World,
  Cleanup,
  createCamera3D,
  EntityCommands,
  BasicMaterial,
  createTransform3D,
  Meshed,
  BasicMaterial3D,
  createRawMovable3D,
  Query,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'

export const cameraRotate = new Demo(
  'camera rotate',
  [addmesh, addCamera3D],
  [update]
)

/**
 * @param {World} world
 */
function addCamera3D(world) {
  const commands = world.getResource(EntityCommands)

  commands
    .spawn()
    .insertPrefab([
      ...createCamera3D(0, 0, 1),
      new Cleanup()
    ])
    .insertPrefab(createRawMovable3D())
    .insert(new Rotation3D())
    .build()
}

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
function update(world){
  const rotable = new Query(world, [Rotation3D])

  rotable.each(([rotation]) => {
    rotation.y = Math.PI / 4
  })
}