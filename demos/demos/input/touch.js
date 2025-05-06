import {
  Mesh,
  CanvasMeshedMaterial,
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
  MaterialHandle
} from 'wima'

/** @type {Map<number,Entity>} */
class TouchtoEntityMap extends Map { }


/**
 * @param {World} world
 */
function init(world) {
  const map = new TouchtoEntityMap()
  const commands = /** @type {EntityCommands} */(world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')

  if (!window) return warn('No window set up')

  const mesh = meshes.add('basic', Mesh.quad2D(50, 50))

  for (let i = 0; i < 10; i++) {
    const entity = commands
      .spawn()
      .insertPrefab(createTransform2D(0, 0))
      .insert(mesh)
      .insert(materials.add('keyboard', new CanvasMeshedMaterial({
        stroke: new Color(0, 255, 0, 255),
        strokeWidth: 10
      })))
      .insert(new Cleanup())
      .build()

    map.set(i, entity)

  }

  world.setResource(map)
}

/**
 * @param {World} world
 */
function update(world) {
  const materials = world.getResource('assets<material>')
  const touches = /** @type {Touches} */(world.getResource('touches'))
  const map = /** @type {TouchtoEntityMap} */(world.getResource('touchtoentitymap'))
  const entities = new Query(world, [Entity,MaterialHandle])

  map.forEach((id, key) => {
    const touch = touches.get(key)
    const entity = entities.get(id)
    const material = materials.getByHandle(entity[1])

    if (touch) {
      entity[0].copy(touch.position)
      material.fill.a = 0
    } else {
      material.fill.a = 255
    }
  })
}
export default new Demo('touch', [init], [update])