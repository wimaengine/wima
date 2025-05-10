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
  Cleanup,
  Material,
  Window,
  Entity,
  MaterialHandle,
  MeshHandle
} from 'wima'

export default new Demo('spawn', [init], [update])

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10


/**
 * @param {World} world
 */
function init(world) {
  const meshes = world.getResourceByName('assets<mesh>')
  const materials = world.getResourceByName('assets<material>')

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
  const commands = world.getResource(EntityCommands)
  const entities = new Query(world, [Entity, Marker])
  const mesh = world.getResource(MeshH).inner
  const material = world.getResource(MeshH).inner
  const window = new Query(world, [Window]).single()  
  
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
    .insert(new MeshHandle(mesh.handle))
    .insert(new MaterialHandle(material.handle))
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