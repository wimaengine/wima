/** @import {Entity} from 'chaosstudio' */
import {
  Mesh,
  CanvasMeshedMaterial,
  createTransform2D,
  World,
  Color,
  Demo,
  Query,
  EntityCommands,
  Cleanup,
  warn
} from 'chaosstudio'

export default new Demo('despawn', [init], [update])

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

/**
 * @param {World} world
 */
function init(world) {
  const commands = /** @type {EntityCommands} */(world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const window = new Query(world, ['window']).single()

  if (!window) return warn('No window set up')

  const width = window[0].getWidth()
  const height = window[0].getHeight()
  const nx = Math.floor(width / itemWidth)
  const ny = Math.floor(height / itemHeight)
  const mesh = meshes.add('material', Mesh.quad2D(
    itemHeight - paddingWidth,
    itemWidth - paddingHeight
  ))
  const material = materials.add('basic', new CanvasMeshedMaterial({
    fill: new Color(1, 1, 1)
  }))

  for (let i = 0; i < nx * ny + 1; i++) {
    const x = ((i % nx) * itemWidth) + itemWidth / 2
    const y = Math.floor(i / nx) * itemHeight + itemHeight / 2

    commands
      .spawn()
      .insertPrefab(createTransform2D(x, y))
      .insert(mesh)
      .insert(material)
      .insert(new Marker())
      .insert(new Cleanup())
      .build()
  }
}

/**
 * @param {World} world
 */
function update(world) {
  const commands = /** @type {EntityCommands} */(world.getResource('entitycommands'))
  const entities = new Query(world, ['entity', 'marker'])
  const entity = entities.single()

  if (!entity) return

  commands.despawn(entity[0])
}

class Marker { }