import {
  Mesh,
  createTransform2D,
  World,
  Color,
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
  MeshAssets,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport } from '../utils.js'

/** @type {Map<KeyCode,Entity>} */
class KeytoEntityMap extends Map { }

const offsetX = -0.9
const offsetY = 0.7
const itemWidth = 0.12
const itemHeight = 0.12
const paddingWidth = 0.03
const paddingHeight = 0.03
const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem(AppSchedule.Startup, addDefaultCamera2D)
  .registerSystem(AppSchedule.Startup, init)
  .registerSystem(AppSchedule.Startup, spawnAlphabet)
  .registerSystem(AppSchedule.Startup, spawnDigits)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerSystem(AppSchedule.Update, update)
  .registerDebugger(new FPSDebugger())
  .run()

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

    const material = materials.get(entity[1].handle)

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

  const mesh = meshes.add(Mesh.quad2D(itemWidth, itemHeight))
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
    const digit = /** @type {KeyCode}*/(digits[i])
    const x = offsetX + (i * (itemWidth + paddingWidth)) + (itemWidth / 2)
    const y = offsetY
    const entity = commands
      .spawn()
      .insertPrefab([
        ...createTransform2D(x, y),
        new Meshed(mesh),
        new BasicMaterial2D(materials.add(new BasicMaterial())),
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
  const mesh = meshes.add(Mesh.quad2D(itemWidth, itemHeight))
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
    const digit = /** @type {KeyCode}*/((alphabet[i]))

    // eslint-disable-next-line no-nested-ternary
    const nx = i < 10 ? i : i < 19 ? i - 10 : i - 19

    // eslint-disable-next-line no-nested-ternary
    const ny = i < 10 ? 0 : i < 19 ? 1 : 2

    const rowSpacing = itemHeight + paddingHeight
    const baseY = offsetY - rowSpacing * 1.5
    const x = offsetX + nx * (itemWidth + paddingWidth) + (itemWidth / 2) + ((itemWidth + paddingWidth) / 2 * ny)
    const y = baseY - (rowSpacing * ny)

    const entity = commands
      .spawn()
      .insertPrefab([
        ...createTransform2D(x, y),
        new Meshed(mesh),
        new BasicMaterial2D(materials.add(new BasicMaterial())),
        new Cleanup()
      ])
      .build()

    map.set(digit, entity)
  }
}
