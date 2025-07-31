import {
  Demo,
  Mesh,
  OrthographicProjection,
  Rotation3D,
  Camera,
  World,
  Cleanup,
  createCamera3D,
  EntityCommands,
  BasicMaterial,
  Meshed,
  BasicMaterial3D,
  createMovable3D,
  Query
} from 'wima'
import { BasicMaterialAssets, MeshAssets } from '../../utils.js'

export const orthograhicCamera = new Demo(
  'orthograhic camera',
  [addmesh, addCamera3D],
  [update]
)

/**
 * @param {World} world
 */
function addCamera3D(world) {
  const commands = world.getResource(EntityCommands)
  const projection = new OrthographicProjection()
  
  commands
    .spawn()
    .insertPrefab([
      ...createCamera3D(0, 0, 1),
      new Cleanup()
    ])
    .insert(new Camera(projection))
    .build()
}

/**
 * @param {World} world
 */
function addmesh(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const mesh = meshes.add(Mesh.triangle3D())
  const material = materials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createMovable3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Cleanup()
    ])
    .insert(new Rotation3D(0, Math.PI / 10, 0))
    .build()
}

/**
 * @param {World} world
 */
function update(world){
  const rotable = new Query(world, [Rotation3D])

  rotable.each(([torque]) => {
    torque.y = Math.PI / 2
  })
}