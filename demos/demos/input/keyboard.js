import {
  Mesh,
  createTransform2D,
  World,
  Color,
  Demo,
  Query,
  EntityCommands,
  Cleanup,
  Keyboard,
  KeyCode,
  Entity,
  BasicMaterial,
  Meshed,
  BasicMaterial2D,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera2D } from '../utils.js'

export default new Demo(
  'keyboard',
  [init, spawnDigits, spawnAlphabet, addDefaultCamera2D],
  [update]
)

const offsetX = -400
const offsetY = -100
const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

/** @type {Map<KeyCode,Entity>} */
class KeytoEntityMap extends Map { }

/**
 * @param {World} world
 */
function init(world) {
  const map = new KeytoEntityMap()

  world.setResource(map)
}

/**
 * @param {World} world
 */
function update(world) {
  const materials = world.getResource(BasicMaterialAssets)
  const keyboard = world.getResource(Keyboard)
  const map = world.getResource(KeytoEntityMap)
  const entities = new Query(world, [Entity, BasicMaterial2D])

  map.forEach((id, key) => {
    const entity = entities.get(id)

    if (!entity) return

    const material = materials.getByHandle(entity[1].handle)

    if (!material) return

    if (keyboard.pressed(key)) {
      material.color.copy(Color.RED)
    } else {
      material.color.copy(Color.WHITE)
    }
  })
}


/**
 * @param {World} world
 */
function spawnDigits(world) {
  const map = world.getResource(KeytoEntityMap)
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('digits', Mesh.quad2D(itemWidth, itemHeight))
  const characters = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0'
  ]
  const digits = [
    KeyCode.Digit1,
    KeyCode.Digit2,
    KeyCode.Digit3,
    KeyCode.Digit4,
    KeyCode.Digit5,
    KeyCode.Digit6,
    KeyCode.Digit7,
    KeyCode.Digit8,
    KeyCode.Digit9,
    KeyCode.Digit0
  ]

  for (let i = 0; i < digits.length; i++) {
    const character = /** @type {string}*/(characters[i])
    const digit = /** @type {KeyCode}*/(digits[i])
    const x = offsetX + (i % digits.length) * (itemWidth + paddingWidth) + paddingWidth
    const y = offsetY + Math.floor(i / digits.length) * (itemHeight + paddingHeight)
    const entity = commands
      .spawn()
      .insertPrefab([
        ...createTransform2D(x, y),
        new Meshed(mesh),
        new BasicMaterial2D(materials.add(`keyboard-${character}`, new BasicMaterial())),
        new Cleanup()
      ])
      .build()

    map.set(digit, entity)
  }
}

/**
 * @param {World} world
 */
function spawnAlphabet(world) {
  const map = world.getResource(KeytoEntityMap)
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const mesh = meshes.add('alphabet', Mesh.quad2D(50, 50))
  const characters = [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm'
  ]
  const alphabet = [
    KeyCode.KeyQ,
    KeyCode.KeyW,
    KeyCode.KeyE,
    KeyCode.KeyR,
    KeyCode.KeyT,
    KeyCode.KeyY,
    KeyCode.KeyU,
    KeyCode.KeyI,
    KeyCode.KeyO,
    KeyCode.KeyP,
    KeyCode.KeyA,
    KeyCode.KeyS,
    KeyCode.KeyD,
    KeyCode.KeyF,
    KeyCode.KeyG,
    KeyCode.KeyH,
    KeyCode.KeyJ,
    KeyCode.KeyK,
    KeyCode.KeyL,
    KeyCode.KeyZ,
    KeyCode.KeyX,
    KeyCode.KeyC,
    KeyCode.KeyV,
    KeyCode.KeyB,
    KeyCode.KeyN,
    KeyCode.KeyM
  ]

  for (let i = 0; i < alphabet.length; i++) {
    const character = /** @type {string}*/((characters[i]))
    const digit = /** @type {KeyCode}*/((alphabet[i]))

    // eslint-disable-next-line no-nested-ternary
    const nx = i < 10 ? i : i < 19 ? i - 10 : i - 19

    // eslint-disable-next-line no-nested-ternary
    const ny = i < 10 ? 0 : i < 19 ? 1 : 2

    const x = offsetX + nx * (itemWidth + paddingWidth) + paddingWidth + itemWidth / 2 + ((itemWidth + paddingWidth) / 2 * ny)
    const y = offsetY + ny * (itemHeight + paddingHeight) + itemHeight / 2 + itemHeight + paddingHeight

    const entity = commands
      .spawn()
      .insertPrefab([
        ...createTransform2D(x, y),
        new Meshed(mesh),
        new BasicMaterial2D(materials.add(`keyboard-alpha-${character}`, new BasicMaterial())),
        new Cleanup()
      ])
      .build()

    map.set(digit, entity)
  }
}