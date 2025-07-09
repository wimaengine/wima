import {
  Mesh,
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
  Entity,
  Mouse,
  MouseButtons,
  Meshed, BasicMaterial,
  BasicMaterial2D
} from 'wima'
import { addDefaultCamera2D, BasicMaterialAssets, MeshAssets } from '../utils.js'

export default new Demo(
  'mouse',
  [spawnButtons, spawnMouseFollower, addDefaultCamera2D],
  [updateFollower, updateButtons]
)

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
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const mesh = meshes.add('basic', Mesh.quad2D(50, 50))
  const commands = world.getResource(EntityCommands)

  const entity = commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new Meshed(mesh),
      new BasicMaterial2D(materials.add('mousepointer', new BasicMaterial({
        color: Color.WHITE.clone()
      }))),
      new Cleanup()
    ])
    .build()

  world.setResource(new MouseEntity(entity))
}


/**
 * @param {World} world
 */
function spawnButtons(world) {
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const map = new KeytoEntityMap()
  const commands = world.getResource(EntityCommands)
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
      .insertPrefab([
        ...createTransform2D(x, y),
        new Meshed(mesh),
        new BasicMaterial2D(materials.add(`mousebutton-${i}`, new BasicMaterial({
          color: Color.WHITE.clone()
        }))),
        new Cleanup()
      ])
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
  const components = query.get(entity)

  if (!components) return

  const [position] = components

  position.copy(mouse.position)
}

/**
 * @param {World} world
 */
function updateButtons(world) {
  const materials = world.getResource(BasicMaterialAssets)
  const mousebuttons = world.getResource(MouseButtons)
  const map = world.getResource(KeytoEntityMap)
  const entities = new Query(world, [Entity, BasicMaterial2D])

  map.forEach((id, key) => {
    const entity = entities.get(id)

    if (!entity) return

    const material = materials.getByHandle(entity[1].handle)

    if (!material) return

    if (mousebuttons.pressed(key)) {
      material.color.copy(Color.RED)
    } else {
      material.color.copy(Color.WHITE)
    }
  })
}