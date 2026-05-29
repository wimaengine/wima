import {
  Mesh,
  createTransform2D,
  World,
  Color,
  Query,
  EntityCommands,
  KeyCode,
  MouseButton,
  Position2D,
  Entity,
  Mouse,
  MouseButtons,
  Meshed,
  BasicMaterial,
  BasicMaterial2D,
  BasicMaterialAssets,
  MeshAssets,
  App,
  DOMWindowPlugin,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  FPSDebugger
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport, pxToNdc } from '../utils.js'

/** @type {Map<KeyCode,Entity>} */
class KeytoEntityMap extends Map { }
class MouseEntity {}

const offsetX = -0.9
const offsetY = 0.8
const itemWidth = 0.15
const itemHeight = 0.15
const paddingWidth = 0.05
const app = new App()

app
  .setResource(new KeytoEntityMap())
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem({ schedule: AppSchedule.Startup, system: spawnButtons })
  .registerSystem({ schedule: AppSchedule.Startup, system: spawnMouseFollower })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerSystem({ schedule: AppSchedule.Update, system: updateFollower })
  .registerSystem({ schedule: AppSchedule.Update, system: updateButtons })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function spawnMouseFollower(world) {
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const mesh = meshes.add(Mesh.quad2D(0.1, 0.1))
  const commands = new EntityCommands(world)

  const entity = commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new Meshed(mesh),
      new BasicMaterial2D(materials.add(new BasicMaterial({
        color: Color.WHITE.clone()
      }))),
      new MouseEntity()
    ])
    .build()
}

/**
 * @param {World} world
 */
function spawnButtons(world) {
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const map = world.getResource(KeytoEntityMap)
  const commands = new EntityCommands(world)
  const mesh = meshes.add(Mesh.quad2D(itemWidth, itemHeight))
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
    const x = offsetX + (i * (itemWidth + paddingWidth)) + (itemWidth / 2)
    const y = offsetY

    const entity = commands
      .spawn()
      .insertPrefab([
        ...createTransform2D(x, y),
        new Meshed(mesh),
        new BasicMaterial2D(materials.add(new BasicMaterial({
          color: Color.WHITE.clone()
        })))])
      .build()

    map.set(digit, entity)
  }
}

/**
 * @param {World} world
 */
function updateFollower(world) {
  const mouse = world.getResource(Mouse)
  const query = new Query(world, [Position2D, MouseEntity])
  const components = query.single()

  if (!components) return

  const [position] = components

  position.copy(pxToNdc(mouse.position.x, mouse.position.y))
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

    const material = materials.get(entity[1].handle)

    if (!material) return

    if (mousebuttons.pressed(key)) {
      material.color.copy(Color.RED)
    } else {
      material.color.copy(Color.WHITE)
    }
  })
}
