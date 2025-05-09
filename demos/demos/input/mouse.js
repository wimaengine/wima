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
  KeyCode,
  MouseButton,
  Position2D,
  MaterialHandle,
  Entity,
  Assets,
  Material,
  Mouse,
  MouseButtons
} from 'wima'

const offsetX = 100
const offsetY = 100
const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10

/** @type {Map<KeyCode,Entity>} */
class KeytoEntityMap extends Map { }
class MouseEntity {

  /**
   * @param {Entity} entity
   */
  constructor(entity) {
    this.entity = entity
  }
}

/**
 * @param {World} world
 */
function spawnMouseFollower(world) {
  const meshes = world.getResourceByName('assets<mesh>')
  const materials = world.getResourceByName('assets<material>')
  const mesh = meshes.add('basic', Mesh.quad2D(50, 50))
  const entity = world.getResource(EntityCommands)
    .spawn()
    .insertPrefab(createTransform2D())
    .insert(mesh)
    .insert(materials.add('mousepointer', new CanvasMeshedMaterial({
      fill:new Color(255, 255, 255, 255),
      stroke: new Color(0, 0, 0, 0),
      strokeWidth: 10
    })))
    .insert(new Cleanup())
    .build()

  world.setResource(new MouseEntity(entity))
}


/**
 * @param {World} world
 */
function spawnButtons(world) {
  const map = new KeytoEntityMap()
  const commands = world.getResource(EntityCommands)
  const meshes = /** @type {Assets<Mesh>} */(world.getResourceByName('assets<mesh>'))
  const materials = /** @type {Assets<Material>} */(world.getResourceByName('assets<material>'))
  const mesh = meshes.add('basic', Mesh.quad2D(50, 50))
  const digits = [
    MouseButton.Left,
    MouseButton.Wheel,
    MouseButton.Right,
    MouseButton.Back,
    MouseButton.Forward,
    MouseButton.Dpi
  ]

  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i]
    const x = offsetX + ((i % digits.length) * (itemWidth + paddingWidth)) + ((itemWidth + paddingWidth) / 2)
    const y = offsetY + Math.floor(i / digits.length) * itemHeight + itemHeight / 2
  
    const entity = commands
      .spawn()
      .insertPrefab(createTransform2D(x, y))
      .insert(mesh)
      .insert(materials.add(`mousebutton-${i}`, new CanvasMeshedMaterial({
        fill:new Color(255, 255, 255, 255),
        stroke: new Color(0, 255, 0, 0),
        strokeWidth: 5
      })))
      .insert(new Cleanup())
      .build()

    map.set(digit, entity)
  }

  world.setResource(map)
}

/**
 * @param {World} world
 */
function updateFollower(world) {
  const { entity } = world.getResource(MouseEntity)
  const mouse = world.getResource(Mouse)
  const query = new Query(world, [Position2D])
  const [position] = query.get(entity)

  position.copy(mouse.position)
}

/**
 * @param {World} world
 */
function updateButtons(world) {
  const materials = world.getResourceByName('assets<material>')
  const mousebuttons = world.getResource(MouseButtons)
  const map = world.getResource(KeytoEntityMap)
  const entities = new Query(world, [Entity, MaterialHandle])

  map.forEach((id, key) => {
    const entity = entities.get(id)
    const material = materials.getByHandle(entity[1])
    
    
    if (mousebuttons.pressed(key)) {
      material.stroke.a = 255
    } else {
      material.stroke.a = 0
    }
  })
}
export default new Demo('mouse', [spawnButtons, spawnMouseFollower], [updateFollower, updateButtons])