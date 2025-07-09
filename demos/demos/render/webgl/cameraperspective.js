import {
  Demo,
  Mesh,
  PerspectiveProjection,
  Camera,
  World,
  Cleanup,
  createCamera3D,
  EntityCommands,
  BasicMaterial,
  BasicMaterial3D,
  Meshed,
  createMovable3D,
  Torque3D,
  Query,
  Rotation2D,
  Rotation3D
} from 'wima'
import { BasicMaterialAssets, MeshAssets } from '../../utils.js'

export const perspectiveCamera = new Demo(
  'perspective camera',
  [addmesh, addCamera3D],
  [update]
)

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
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('basic', Mesh.triangle3D())
  const material = materials.add('basic', new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createMovable3D(),
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
  const rotable = new Query(world,[Rotation3D])

  rotable.each(([torque])=>{
    torque.y = Math.PI / 2
  })
}