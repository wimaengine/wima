import {
  Demo,
  Mesh,
  Position3D,
  Rotation3D,
  World,
  Cleanup,
  EntityCommands,
  BasicMaterial,
  Meshed,
  BasicMaterial3D,
  createMovable3D,
  Query,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera3D } from '../../utils.js'

export const geometries = new Demo(
  'mesh geometries',
  [addmeshes, addDefaultCamera3D],
  [update]
)

/**
 * @param {World} world
 */
function addmeshes(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const geometries = [
    meshes.add( Mesh.triangle3D()),
    meshes.add(Mesh.plane3D()),
    meshes.add( Mesh.circle3D()),
    meshes.add(Mesh.ring3D()),
    meshes.add(Mesh.cone()),
    meshes.add(Mesh.cube(0.7071, 0.7071, 0.7071)),
    meshes.add(Mesh.uvSphere()),
    meshes.add(Mesh.torus()),
    meshes.add(Mesh.cylinder())
  ]
  const material = materials.add(new BasicMaterial())

  const offsetX = -2.1,
    offsetY = 2,
    width = 1.1,
    height = 1.2,
    numX = 4

  for (let i = 0; i < geometries.length; i++) {
    commands
      .spawn()
      .insertPrefab([
        ...createMovable3D(),
        new Meshed(geometries[i]),
        new BasicMaterial3D(material),
        new Cleanup()
      ])
      .insert(new Position3D(
        offsetX + width * (i % numX),
        offsetY - Math.floor(i / numX) * height,
        -1
      ))
      .insert(new Rotation3D())
      .build()
  }
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