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
  warn,
  Window,
  Entity
} from 'wima'

export default new Demo('despawn', [init], [update])

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResourceByName('assets<mesh>')
  const materials = world.getResourceByName('assets<material>')
  const window = new Query(world, [Window]).single()

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
  const commands = world.getResource(EntityCommands)
  const entities = new Query(world, [Entity, Marker])
  const entity = entities.single()

  if (!entity) return

  commands.despawn(entity[0])
}

class Marker { }