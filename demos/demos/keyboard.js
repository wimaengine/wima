/** @import {Entity} from 'chaosstudio' */
import {
  Assets,
  Material,
  Mesh,
  CanvasTextMaterial,
  CanvasMeshedMaterial,
  createTransform2D,
  World,
  Color,
  Demo,
  Query,
  EntityCommands,
  Cleanup,
  Keyboard,
  KeyCode
} from 'chaosstudio'

const offsetX = 100
const offsetY = 100
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
  const materials = /** @type {Assets<Material>} */(world.getResource('assets<material>'))
  const keyboard = /** @type {Keyboard} */(world.getResource('keyboard'))
  const map = /** @type {KeytoEntityMap} */(world.getResource('keytoentitymap'))
  const entities = new Query(world, ['entity', 'materialhandle'])

  map.forEach((id, key) => {
    const entity = entities.get(id)
    const material = materials.getByHandle(entity[1])

    if (keyboard.pressed(key)) {
      material.stroke.a = 255
    } else {
      material.stroke.a = 0
    }
  })
}


/**
 * @param {World} world
 */
function spawnDigits(world) {
  const map = world.getResource('keytoentitymap')
  const commands = /** @type {EntityCommands} */(world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const mesh = meshes.add('digits', Mesh.quad2D(itemWidth, itemHeight))
  const meshtext = meshes.add('digitsText', Mesh.quad2D())
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
    const character = characters[i]
    const digit = digits[i]
    const x = offsetX + (i % digits.length) * (itemWidth + paddingWidth) + paddingWidth + itemWidth / 2
    const y = offsetY + Math.floor(i / digits.length) * (itemHeight + paddingHeight) + itemHeight / 2
    const entity = commands
      .spawn()
      .insertPrefab(createTransform2D(x, y))
      .insert(mesh)
      .insert(materials.add(`keyboard-${character}`, new CanvasMeshedMaterial({
        fill: new Color(255, 255, 255, 255),
        stroke: new Color(0, 255, 0, 0),
        strokeWidth: 5
      })))
      .insert(new Cleanup())
      .build()

    commands
      .spawn()
      .insertPrefab(createTransform2D(x, y + itemHeight / 4))
      .insert(meshtext)
      .insert(materials.add(`keyboard-text-${character}`, new CanvasTextMaterial({
        text: character,
        fill: new Color(0, 0, 0, 255),
        stroke: new Color(0, 0, 0, 255),
        fontSize: 30,
        align: 'center'
      })))
      .insert(new Cleanup())
      .build()
    map.set(digit, entity)
  }
}

/**
 * @param {World} world
 */
function spawnAlphabet(world) {
  const map = world.getResource('keytoentitymap')
  const commands = /** @type {EntityCommands} */(world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const mesh = meshes.add('alphabet', Mesh.quad2D(50, 50))
  const meshte = meshes.add('basic', Mesh.quad2D(50, 50))
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
    const character = characters[i]
    const digit = alphabet[i]
    const nx = i < 10 ? i : i < 19 ? i - 10 : i - 19
    const ny = i < 10 ? 0 : i < 19 ? 1 : 2
    const x = offsetX + nx * (itemWidth + paddingWidth) + paddingWidth + itemWidth / 2 + ((itemWidth + paddingWidth) / 2 * ny)
    const y = offsetY + ny * (itemHeight + paddingHeight) + itemHeight / 2 + itemHeight + paddingHeight
    
    const entity = commands
      .spawn()
      .insertPrefab(createTransform2D(x, y))
      .insert(mesh)
      .insert(materials.add(`keyboard-alpha-${character}`, new CanvasMeshedMaterial({
        fill: new Color(255, 255, 255, 255),
        stroke: new Color(0, 255, 0, 0),
        strokeWidth: 10
      })))
      .insert(new Cleanup())
      .build()

    commands
      .spawn()
      .insertPrefab(createTransform2D(x, y + itemHeight / 4))
      .insert(meshte)
      .insert(materials.add(`keyboard-alpha-text-${character}`, new CanvasTextMaterial({
        text: character,
        fill:new Color(0, 0, 0, 255),
        stroke:new Color(0, 0, 0, 255),
        fontSize: 20,
        align: 'center'
      })))
      .insert(new Cleanup())
      .build()

    map.set(digit, entity)
  }
}

export default new Demo('keyboard', [init, spawnDigits, spawnAlphabet], [update])