import {
  Mesh,
  CanvasMeshedMaterial,
  createTransform2D,
  World,
  Color,
  Demo,
  Query,
  EntityCommands,
  Handle,
  warn,
  Cleanup
} from 'chaosstudio'

export default new Demo('spawn', [init], [update])

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10


/**
 * @param {World} world
 */
function init(world) {
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')

  const mesh = meshes.add('material', Mesh.quad2D(itemHeight - paddingWidth, itemWidth - paddingHeight))
  const material = materials.add('basic', new CanvasMeshedMaterial({
    fill: new Color(1, 1, 1)
  }))

  world.setResource(new MaterialH(material))
  world.setResource(new MeshH(mesh))
  world.registerType(Marker)
}

/**
 * @param {World} world
 */
function update(world) {  
  const commands = /** @type {EntityCommands} */(world.getResource('entitycommands'))
  const entities = new Query(world, ['entity', 'marker'])
  const mesh = /** @type {MeshH} */(world.getResource('meshh')).inner
  const material = /** @type {MeshH} */(world.getResource('materialh')).inner
  const window = new Query(world, ['window']).single()
  
  if(!window) return warn('No window set up.')

  const width = window[0].getWidth()
  const height = window[0].getHeight()
  const nx = Math.floor(width / itemWidth)
  const x = ((entities.count() % nx) * itemWidth) + itemWidth / 2
  const y = Math.floor(entities.count() / nx) * itemHeight + itemHeight / 2

  if (y > height) return

  commands
    .spawn()
    .insertPrefab(createTransform2D(x, y))
    .insert(mesh)
    .insert(material)
    .insert(new Marker())
    .insert(new Cleanup())
    .build()
}

class Marker {}
class MaterialH {

  /**
   * @param {Handle<Material>} inner
   */
  constructor(inner) {
    this.inner = inner
  }
}
class MeshH {

  /**
   * @param {Handle<Mesh>} inner
   */
  constructor(inner) {
    this.inner = inner
  }
}