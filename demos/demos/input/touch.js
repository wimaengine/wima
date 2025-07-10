import {
  Mesh,
  createTransform2D,
  World,
  Color,
  Demo,
  Query,
  EntityCommands,
  warn,
  Cleanup,
  Touches,
  Entity,
  Position2D,
  BasicMaterial,
  BasicMaterial2D,
  Meshed
} from 'wima'
import { addDefaultCamera2D, BasicMaterialAssets, MeshAssets } from '../utils.js'

export default new Demo(
  'touch',
  [init, addDefaultCamera2D],
  [update]
)

/** @type {Map<number,Entity>} */
class TouchtoEntityMap extends Map { }


/**
 * @param {World} world
 */
function init(world) {
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const map = new TouchtoEntityMap()
  const commands = world.getResource(EntityCommands)

  if (!window) return warn('No window set up')

  const mesh = meshes.add('basic', Mesh.quad2D(50, 50))

  for (let i = 0; i < 10; i++) {
    const entity = commands
      .spawn()
      .insertPrefab([
        ...createTransform2D(0, 0),
        new Meshed(mesh),
        new BasicMaterial2D(materials.add(`touch-${i}`, new BasicMaterial({
          color: Color.WHITE.clone()
        }))),
        new Cleanup()
      ])
      .build()

    map.set(i, entity)

  }

  world.setResource(map)
}

/**
 * @param {World} world
 */
function update(world) {
  const materials = world.getResource(BasicMaterialAssets)
  const touches = world.getResource(Touches)
  const map = world.getResource(TouchtoEntityMap)
  const entities = new Query(world, [Position2D, BasicMaterial2D])

  map.forEach((id, key) => {
    const touch = touches.get(key)
    const components = entities.get(id)

    if (!components) return

    const material = materials.getByHandle(components[1].handle)

    if(!material) return

    if (touch) {
      components[0].copy(touch.position)
      material.color.copy(Color.RED)
    } else {
      material.color.copy(Color.WHITE)
    }
  })
}