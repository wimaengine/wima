import {
  Demo,
  Mesh,
  World,
  Cleanup,
  Rotation3D,
  EntityCommands,
  Meshed,
  BasicMaterial3D,
  BasicMaterial,
  createMovable3D,
  Query,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera3D } from '../../utils.js'

export const rotatingtriangle = new Demo(
  'rotating triangle',
  [addmesh, addDefaultCamera3D],
  [update]
)

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
    .insert(new Rotation3D())
    .build()
}

/**
 * @param {World} world
 */
function update(world){
  const rotable = new Query(world, [Rotation3D])

  rotable.each(([rotation]) => {
    rotation.z = Math.PI / 4
  })
}