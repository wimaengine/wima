import {
  Mesh,
  createTransform2D,
  World,
  Demo,
  Query,
  EntityCommands,
  Cleanup,
  Entity,
  BasicMaterial,
  Meshed,
  BasicMaterial2D,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera2D } from '../utils.js'

export default new Demo('despawn', [init, addDefaultCamera2D], [update])

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const width = 1000
  const height = 600
  const halfWidth = width / 2
  const halfHeight = height / 2
  const mesh = meshes.add('despawn', Mesh.quad2D(
    itemHeight - paddingWidth,
    itemWidth - paddingHeight
  ))
  const material = materials.add('basic', new BasicMaterial())

  for (let y = -halfHeight; y <= halfHeight; y += itemHeight) {
    for (let x = -halfWidth; x < halfWidth; x += itemWidth) {
      commands
        .spawn()
        .insertPrefab([
          ...createTransform2D(x, y),
          new Meshed(mesh),
          new BasicMaterial2D(material),
          new Marker(),
          new Cleanup()
        ])
        .build()
    }
  }
}

/**
 * @param {World} world
 */
function update(world) {
  const commands = world.getResource(EntityCommands)
  const entities = new Query(world, [Entity, Marker])
  const entity = entities.single()

  if (!entity) return

  commands.despawn(entity[0])
}

class Marker { }